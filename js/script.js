// Логика страницы: валидация форм, попап успеха, анимация появления секций.
document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('success-modal');
    var lastFocused = null;

    // Открыть попап успешной отправки (Форма 3)
    function openModal() {
        if (!modal) return;
        lastFocused = document.activeElement;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        var dialog = modal.querySelector('.modal__dialog');
        dialog.setAttribute('tabindex', '-1');
        dialog.focus();
    }

    // Закрыть попап и вернуть фокус на элемент, с которого открывали
    function closeModal() {
        if (!modal) return;
        modal.hidden = true;
        document.body.style.overflow = '';
        if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus();
        }
    }

    if (modal) {
        // Закрытие по клику на фон/кнопки с data-close
        modal.addEventListener('click', function (e) {
            if (e.target.hasAttribute('data-close')) closeModal();
        });
        // Закрытие по Esc
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !modal.hidden) closeModal();
        });
    }

    function fieldOf(input) {
        return input.closest('.field');
    }

    // ФИО: только буквы, пробел и дефис, минимум 2 символа
    function isValidName(value) {
        var t = value.trim();
        return t.length >= 2 && /^[A-Za-zА-Яа-яЁё\s-]+$/.test(t);
    }

    // Телефон: 10–15 цифр
    function isValidPhone(value) {
        var digits = value.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
    }

    // Показать/скрыть сообщение об ошибке у поля
    function markInvalid(input, valid) {
        var field = fieldOf(input);
        if (!field) return valid;
        field.classList.toggle('is-invalid', !valid);
        return valid;
    }

    // В поле телефона разрешаем только цифры и символы +()-
    document.querySelectorAll('input[type="tel"]').forEach(function (input) {
        input.addEventListener('input', function () {
            input.value = input.value.replace(/[^\d+()\-\s]/g, '');
        });
    });

    document.querySelectorAll('.js-form').forEach(function (form) {
        var inputs = form.querySelectorAll('input');
        var formId = form.getAttribute('data-form');

        // Сброс ошибки при вводе
        inputs.forEach(function (input) {
            input.addEventListener('input', function () {
                var field = fieldOf(input);
                if (field) field.classList.remove('is-invalid');
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var allValid = true;
            inputs.forEach(function (input) {
                var valid = input.name === 'phone' ? isValidPhone(input.value) : isValidName(input.value);
                if (!markInvalid(input, valid)) allValid = false;
            });

            // Форма 1 — по заданию имитируем неуспешную отправку из-за ошибок ввода
            if (formId === '1') {
                allValid = false;
                inputs.forEach(function (input) {
                    markInvalid(input, false);
                });
            }

            // Форма 2 и 3 — при корректных данных показываем попап успеха
            if (allValid) {
                form.reset();
                openModal();
            }
        });
    });

    // Анимация появления секций при прокрутке.
    // Класс .reveal ставится из JS — без скриптов контент остаётся видимым.
    var revealEls = document.querySelectorAll('.section');
    if ('IntersectionObserver' in window && revealEls.length) {
        revealEls.forEach(function (el) {
            el.classList.add('reveal');
        });
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
        revealEls.forEach(function (el) {
            io.observe(el);
        });
    }
});
