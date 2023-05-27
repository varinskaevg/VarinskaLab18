document.addEventListener('DOMContentLoaded', function() {
    const timerElement = document.getElementById('timer');
    const gameBoard = document.getElementById('game-board');
    const restartBtn = document.getElementById('restart-btn');
    const statsBody = document.getElementById('stats-body');
    const congratsModal = document.getElementById('congrats-modal');
    const playAgainBtn = document.getElementById('play-again-btn');

    let timer = 60;
    let selectedNumbers = [];
    let numberElements = [];
    let attempts = 0;
    let bestResult = Infinity;
    let startTime = 0;
    let endTime = 0;

    // Функція для генерації випадкового кольору
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Функція для створення числа на полі гри
    function createNumberElement(number) {
        const numberElement = document.createElement('div');
        numberElement.textContent = number;
        numberElement.classList.add('number');
        numberElement.style.color = getRandomColor();
        numberElement.style.fontSize = `${Math.floor(Math.random() * 16) + 10}px`;
        numberElement.style.border = '1px solid black'; // Додати рамку
        numberElement.style.padding = '5px'; // Додати відступи в межах рамки
        numberElement.addEventListener('click', function() {
            if (selectedNumbers.length + 1 === number) {
                selectedNumbers.push(number);
                numberElement.style.backgroundColor = '#ffff99';
                if (selectedNumbers.length === 20) {
                    // Гра завершена
                    congratsModal.classList.add('show');
                    updateStats();
                }
            } else {
                // Неправильний вибір числа
                alert('Не вірна цифра');
            }
        });
        return numberElement;
    }


    // Функція для оновлення таймера
    function updateTimer() {
        timerElement.textContent = timer;
        if (timer === 0) {
            // Гра завершена
            alert('Час вийшов!');
            updateStats();
            clearInterval(interval); // зупиняємо оновлення таймера
        } else {
            timer--;
        }
    }

    function startTimer() {
        interval = setInterval(updateTimer, 1000); // оновлюємо таймер кожну секунду
    }
    startTimer();

    // Функція для перемішування масиву
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Функція для початку нової гри
    function startGame() {
        timer = 60;
        selectedNumbers = [];
        gameBoard.innerHTML = '';
        numberElements = [];

        const numbers = shuffleArray(Array.from({length: 20}, (_, i) => i + 1));

        for (let i = 0; i < 20; i++) {
            const numberElement = createNumberElement(numbers[i]);
            numberElements.push(numberElement);
            gameBoard.appendChild(numberElement);
        }

        updateTimer();
        attempts++;
        startTime = Date.now(); // Запам'ятовуємо початковий час гри
    }

    // Функція для оновлення статистики
    function updateStats() {
        const statsRow = document.createElement('tr');
        const attemptsCell = document.createElement('td');
        const resultCell = document.createElement('td');
        const timeCell = document.createElement('td');
        attemptsCell.textContent = attempts;
        resultCell.textContent = selectedNumbers.length;
        endTime = Date.now(); // Запам'ятовуємо час завершення гри
        const gameTime = Math.floor((endTime - startTime) / 1000); // Вираховуємо тривалість гри в секундах
        timeCell.textContent = gameTime;
        statsRow.appendChild(attemptsCell);
        statsRow.appendChild(resultCell);
        statsRow.appendChild(timeCell);
        statsBody.appendChild(statsRow);

        if (selectedNumbers.length === 20 && attempts < bestResult) {
            bestResult = attempts;
            statsRow.style.backgroundColor = '#c7ecc7';
        }
    }

    restartBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', function() {
        congratsModal.classList.remove('show');
        startGame();
    });

    startGame();
});