<?php
/**
 * Приём заявок с сайта «Теплота» и отправка их в Telegram.
 *
 * Кладётся в корень хостинга рядом с config.php.
 * Сайт остаётся на GitHub Pages и обращается сюда через CORS.
 *
 * Настройки — в config.php, он в репозиторий не попадает.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$cfg = @include __DIR__ . '/config.php';
if (!is_array($cfg)) {
    http_response_code(500);
    exit('{"error":"not_configured"}');
}

/* ---------- CORS ---------- */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = isset($cfg['allowed_origins']) ? $cfg['allowed_origins'] : array();

if ($origin !== '' && in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    exit('{"error":"method_not_allowed"}');
}
if ($origin !== '' && !in_array($origin, $allowed, true)) {
    http_response_code(403);
    exit('{"error":"forbidden_origin"}');
}

/* ---------- Простой лимит: не больше N заявок с одного адреса в час ---------- */
$limit = (int)($cfg['per_hour'] ?? 10);
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$bucket = sys_get_temp_dir() . '/teplota_' . md5($ip) . '.txt';
$stored = file_exists($bucket) ? (array)json_decode((string)file_get_contents($bucket), true) : array();
$hits = array_values(array_filter($stored, function ($t) {
    return is_int($t) && $t > time() - 3600;
}));
if (count($hits) >= $limit) {
    http_response_code(429);
    exit('{"error":"too_many"}');
}
$hits[] = time();
@file_put_contents($bucket, json_encode($hits));

/* ---------- Заявка ---------- */
$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 8000) {
    http_response_code(413);
    exit('{"error":"too_large"}');
}
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    exit('{"error":"bad_request"}');
}

function clean_value($v): string
{
    $s = is_scalar($v) ? (string)$v : '';
    $s = preg_replace('/[\x00-\x1f\x7f]/u', ' ', $s) ?? '';
    return trim(mb_substr($s, 0, 500));
}

$phone = clean_value($data['Телефон'] ?? '');
if (strlen(preg_replace('/\D/', '', $phone) ?? '') < 10) {
    http_response_code(400);
    exit('{"error":"bad_phone"}');
}

/* Порядок полей в сообщении; всё остальное допишется следом */
$order = ['Ваше имя', 'Телефон', 'Что нужно сделать', 'Объект', 'Комментарий', 'Страница'];
$skip = ['Согласен на обработку персональных данных и ознакомлен с политикой конфиденциальности'];

$lines = [];
foreach ($order as $key) {
    if (!empty($data[$key])) {
        $lines[] = htmlspecialchars($key, ENT_NOQUOTES, 'UTF-8') . ': '
            . htmlspecialchars(clean_value($data[$key]), ENT_NOQUOTES, 'UTF-8');
    }
}
foreach ($data as $key => $value) {
    if (in_array($key, $order, true) || in_array($key, $skip, true) || empty($value)) {
        continue;
    }
    $lines[] = htmlspecialchars(clean_value($key), ENT_NOQUOTES, 'UTF-8') . ': '
        . htmlspecialchars(clean_value($value), ENT_NOQUOTES, 'UTF-8');
}

$text = "<b>Заявка с сайта «Теплота»</b>\n\n" . implode("\n", $lines);
$text = mb_substr($text, 0, 4000);

/* ---------- Доставка ---------- */
function http_post_json(string $url, array $payload): array
{
    $body = json_encode($payload, JSON_UNESCAPED_UNICODE);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
        ]);
        $out = curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err = curl_error($ch);
        curl_close($ch);
        return ['code' => $code, 'body' => (string)$out, 'error' => $err];
    }

    $ctx = stream_context_create(['http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\n",
        'content' => $body,
        'timeout' => 15,
        'ignore_errors' => true,
    ]]);
    $out = @file_get_contents($url, false, $ctx);
    $code = 0;
    foreach ($http_response_header ?? [] as $h) {
        if (preg_match('#HTTP/\S+\s+(\d+)#', $h, $m)) {
            $code = (int)$m[1];
        }
    }
    return ['code' => $code, 'body' => (string)$out, 'error' => $out === false ? 'request failed' : ''];
}

$channel = $cfg['channel'] ?? 'telegram';
$ok = false;

if ($channel === 'telegram') {
    $r = http_post_json(
        'https://api.telegram.org/bot' . $cfg['telegram_token'] . '/sendMessage',
        [
            'chat_id' => $cfg['telegram_chat_id'],
            'text' => $text,
            'parse_mode' => 'HTML',
            'disable_web_page_preview' => true,
        ]
    );
    $ok = $r['code'] === 200;
    if (!$ok) {
        error_log('teplota lead: telegram ' . $r['code'] . ' ' . $r['error'] . ' ' . mb_substr($r['body'], 0, 300));
    }
}

/* Почта — запасной канал: включается сама, если Telegram не ответил */
if (!$ok && !empty($cfg['email'])) {
    $plain = str_replace(['<b>', '</b>'], '', $text);
    $headers = "MIME-Version: 1.0\r\n"
        . "Content-Type: text/plain; charset=utf-8\r\n"
        . 'From: ' . ($cfg['mail_from'] ?? ('noreply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost'))) . "\r\n";
    $ok = @mail($cfg['email'], 'Заявка с сайта «Теплота»', $plain, $headers);
    if (!$ok) {
        error_log('teplota lead: mail() тоже не прошла');
    }
}

if (!$ok) {
    http_response_code(502);
    exit('{"error":"upstream"}');
}

echo '{"ok":true}';
