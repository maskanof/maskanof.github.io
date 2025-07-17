<?php
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);
    
    try {
        $stmt = $pdo->prepare("INSERT INTO feedback (name, email, message, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$name, $email, $message]);
        
        header("Location: feedback.html?success=1");
        exit();
    } catch (PDOException $e) {
        die("Ошибка при сохранении отзыва: " . $e->getMessage());
    }
}

// Получение всех отзывов
$stmt = $pdo->query("SELECT * FROM feedback ORDER BY created_at DESC");
$feedbacks = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<?php
require 'db_connect.php';

// Обработка запроса на получение последних отзывов
if (isset($_GET['action']) && $_GET['action'] == 'get_latest') {
    $stmt = $pdo->query("SELECT name, message, created_at FROM feedback ORDER BY created_at DESC LIMIT 3");
    $feedbacks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    header('Content-Type: application/json');
    echo json_encode($feedbacks);
    exit;
}

// ... остальной код обработки формы ...
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Отзывы</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav>
        <a href="index.html">Главная</a>
        <a href="feedback.html">Обратная связь</a>
        <a href="todo.html">ToDo List</a>
    </nav>
    
    <div class="container">
        <h1>Отзывы</h1>
        
        <?php if (isset($_GET['success'])): ?>
            <div class="alert success">
                Ваш отзыв успешно отправлен!
            </div>
        <?php endif; ?>
        
        <h2>Последние отзывы:</h2>
        
        <?php foreach ($feedbacks as $feedback): ?>
            <div class="feedback-item">
                <h3><?= $feedback['name'] ?></h3>
                <p><?= $feedback['message'] ?></p>
                <div class="feedback-meta">
                    <span><?= $feedback['email'] ?></span>
                    <span><?= $feedback['created_at'] ?></span>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</body>
</html>