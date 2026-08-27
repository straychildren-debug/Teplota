<?php
/**
 * Проверка хостинга перед настройкой обработчика.
 *
 * Залейте рядом с send.php, откройте в браузере, посмотрите ответ,
 * ПОСЛЕ ЧЕГО УДАЛИТЕ — файл не должен оставаться на боевом сайте.
 *
 * Токен тут не нужен: проверяется только доступность и версия PHP.
 */

header('Content-Type: text/plain; charset=utf-8');

echo "PHP: " . PHP_VERSION . "\n";
echo "cURL: " . (function_exists('curl_init') ? 'есть' : 'нет') . "\n";
echo "allow_url_fopen: " . (ini_get('allow_url_fopen') ? 'вкл' : 'выкл') . "\n";
echo "mail(): " . (function_exists('mail') ? 'есть' : 'нет') . "\n";
echo "mbstring: " . (function_exists('mb_substr') ? 'есть' : 'НЕТ — сообщите мне') . "\n";
echo "HTTPS: " . (empty($_SERVER['HTTPS']) ? 'НЕТ — страница открыта по http' : 'да') . "\n";
echo str_repeat('-', 40) . "\n";

$url = 'https://api.telegram.org';
$start = microtime(true);

if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_NOBODY => true,
    ]);
    curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
} else {
    $ctx = stream_context_create(['http' => ['timeout' => 15, 'ignore_errors' => true]]);
    $code = @file_get_contents($url, false, $ctx) === false ? 0 : 200;
    $err = $code ? '' : 'file_get_contents не смог';
}

$ms = round((microtime(true) - $start) * 1000);

echo "api.telegram.org -> код $code, {$ms} мс\n";
echo $err ? "ошибка: $err\n" : '';
echo str_repeat('-', 40) . "\n";

if ($code > 0) {
    echo "ИТОГ: Telegram с этого хостинга доступен. В config.php оставляйте channel = 'telegram'.\n";
} else {
    echo "ИТОГ: Telegram недоступен. В config.php ставьте channel = 'email'.\n";
}
echo "\nНе забудьте удалить этот файл.\n";
