/* Мишка-копилка 🐻🌸 — логика страницы */
(function () {
  "use strict";

  var PHONE_PRETTY = "+7 952 836-38-44";
  var PHONE_RAW = "+79528363844";
  var COUNTER_KEY = "bear_money_cuteness";

  // Ссылка на «Визитку для сбора денег» ЮMoney.
  // Вставь сюда свою ссылку вида https://yoomoney.ru/to/410011XXXXXXXXXX —
  // и кнопка «Оплатить из любого банка» появится на странице сама.
  var YOOMONEY_URL = "";

  var toastEl = document.getElementById("toast");
  var hintEl = document.getElementById("hint");
  var counterEl = document.getElementById("counterValue");
  var toastTimer = null;

  /* ---------- Всплывашки ---------- */
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 2600);
  }

  /* ---------- Копирование в буфер ---------- */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(area);
      }
    });
  }

  function copyPhone(onSuccess) {
    copyText(PHONE_RAW).then(function () {
      onSuccess();
    }).catch(function () {
      toast("Номер: " + PHONE_PRETTY);
    });
  }

  /* ---------- Счётчик милоты ---------- */
  function readCounter() {
    var value = parseInt(window.localStorage.getItem(COUNTER_KEY) || "0", 10);
    return isNaN(value) ? 0 : value;
  }

  function renderCounter() {
    counterEl.textContent = readCounter();
  }

  function bumpCounter() {
    var next = readCounter() + 1;
    try {
      window.localStorage.setItem(COUNTER_KEY, String(next));
    } catch (err) {
      /* приватный режим — просто не сохраняем */
    }
    renderCounter();
    return next;
  }

  /* ---------- Кнопки сумм ---------- */
  document.getElementById("amounts").addEventListener("click", function (event) {
    var button = event.target.closest(".btn[data-sum]");
    if (!button) return;
    var sum = button.getAttribute("data-sum");
    copyPhone(function () {
      toast("Номер " + PHONE_PRETTY + " скопирован! Открой свой банк → СБП → по номеру → " + sum + " ₽ 🐻");
      hintEl.textContent = "СБП из любого банка → по номеру → " + sum + " ₽ 🍯";
      spawnHearts(6);
    });
  });

  /* ---------- Кнопка «Скопировать номер» ---------- */
  document.getElementById("copyPhone").addEventListener("click", function () {
    copyPhone(function () {
      toast("Номер скопирован: " + PHONE_PRETTY + " 🌸");
      spawnHearts(4);
    });
  });

  /* ---------- Кнопка «Я скинул(а)!» ---------- */
  var compliments = [
    "Ты чудо! 🥰 Мишка в восторге!",
    "Спасибо, зайка! 🐾 Обнимаю крепко!",
    "Мёд уже близко 🍯💕",
    "Ты самая милая 💗 Мишка счастлив!",
    "Ого, спасибо! 🐻 Сердечко тает...",
    "Мишка передаёт тебе лапку 🐾💝"
  ];

  document.getElementById("doneBtn").addEventListener("click", function () {
    var index = Math.floor(Math.random() * compliments.length);
    toast(compliments[index]);
    bumpCounter();
    spawnHearts(14);
  });

  /* ---------- Летающие сердечки ---------- */
  var heartsBg = document.getElementById("heartsBg");
  var GLYPHS = ["💗", "🌸", "💕", "🐻", "💖", "🎀"];

  function spawnHearts(count) {
    for (var i = 0; i < count; i++) {
      var heart = document.createElement("span");
      heart.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      heart.style.left = (5 + Math.random() * 90) + "vw";
      heart.style.fontSize = (14 + Math.random() * 20) + "px";
      var duration = 3.5 + Math.random() * 2.5;
      heart.style.animationDuration = duration + "s";
      heart.style.animationDelay = (Math.random() * 0.5) + "s";
      heartsBg.appendChild(heart);
      (function (node) {
        setTimeout(function () {
          if (node.parentNode) node.parentNode.removeChild(node);
        }, (duration + 1) * 1000);
      })(heart);
    }
  }

  function ambientHearts() {
    setInterval(function () {
      if (!document.hidden) spawnHearts(1);
    }, 1400);
  }

  /* ---------- QR: мягкая деградация ---------- */
  var qrImg = document.getElementById("qrImg");
  var qrNote = document.getElementById("qrNote");
  qrImg.addEventListener("error", function () {
    qrImg.parentNode.style.display = "none";
    qrNote.textContent = "QR пока не загрузился — просто переведи по номеру выше 💗";
  });

  /* ---------- Кнопка ЮMoney (появляется только если задана ссылка) ---------- */
  var yooBlock = document.getElementById("yoomoneyBlock");
  var yooBtn = document.getElementById("yoomoneyBtn");
  if (yooBlock && yooBtn) {
    if (YOOMONEY_URL) {
      yooBtn.href = YOOMONEY_URL;
      yooBlock.hidden = false;
    } else {
      yooBlock.hidden = true;
    }
  }

  /* ---------- Старт ---------- */
  renderCounter();
  ambientHearts();
})();
