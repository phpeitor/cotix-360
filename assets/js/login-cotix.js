(() => {
    "use strict";

    const byId = id => document.getElementById(id);
    const app = byId("login-app");
    if (!app) return;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;
    const backgroundVideo = byId("login-background-video");
    if (backgroundVideo) {
        const videoNumber = Math.floor(Math.random() * 4) + 1;
        const source = document.createElement("source");
        source.src = `./assets/resources/video${videoNumber}.mp4`;
        source.type = "video/mp4";
        source.addEventListener("error", () => { backgroundVideo.hidden = true; });
        backgroundVideo.appendChild(source);
        backgroundVideo.addEventListener("loadeddata", () => {
            backgroundVideo.hidden = false;
        }, { once: true });
        backgroundVideo.addEventListener("error", () => {
            backgroundVideo.hidden = true;
        }, { once: true });
        backgroundVideo.load();
        if (reducedMotion) backgroundVideo.pause();
        else backgroundVideo.play().catch(() => { backgroundVideo.hidden = true; });
    }

    window.setTimeout(() => {
        if (window.cotixLoginReady) return;
        window.cotixLoginFallback = true;
        const form = byId("login-form");
        const verification = byId("verification-step");
        if (form) form.hidden = false;
        if (verification) verification.hidden = true;
    }, 2500);

    const themeKey = "cotix360_login_theme";
    const rememberedUserKey = "cotix360_login_user";
    const verificationStep = byId("verification-step");
    const verifyButton = byId("verify-button");
    const verifyLabel = verifyButton.querySelector(".verify-button-label span");
    const verifyMessage = byId("verification-message");
    const verificationLive = byId("verification-live");
    const loginForm = byId("login-form");
    const userInput = byId("login-user");
    const passwordInput = byId("login-password");
    const loginSubmit = byId("login-submit");
    const loginError = byId("login-error");
    const rememberUser = byId("remember-user");
    const capsLockHint = byId("caps-lock-hint");
    const holdDuration = reducedMotion ? 850 : 1450;
    const captchaSiteKey = String(app.dataset.recaptchaSiteKey || "").trim();

    let holdStartedAt = 0;
    let holdFrame = 0;
    let pointerId = null;
    let isVerified = Boolean(window.cotixLoginFallback);
    let isSubmitting = false;
    let lockInterval = null;
    let riveInstance = null;
    let recaptchaLoader = null;
    let riveScriptLoading = false;
    let bearHandsUp = false;
    let bearHandsDownAt = 0;
    const riveInputs = { checking: null, look: null, hands: null, success: null, fail: null };

    function readStorage(key) {
        try { return window.localStorage.getItem(key); } catch (_) { return null; }
    }

    function writeStorage(key, value) {
        try {
            if (value === null) window.localStorage.removeItem(key);
            else window.localStorage.setItem(key, value);
        } catch (_) { /* Storage may be disabled by browser policy. */ }
    }

    function setTheme(theme) {
        const dark = theme === "dark";
        app.classList.toggle("is-dark", dark);
        document.documentElement.classList.toggle("cotix-login-dark", dark);
        const brandLogo = byId("brand-logo");
        if (brandLogo) {
            brandLogo.src = dark
                ? "./assets/resources/phpeitor-light.svg?v=2.0"
                : "./assets/resources/phpeitor-dark.svg?v=2.0";
        }
        const button = byId("theme-toggle");
        button.setAttribute("aria-label", dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
        button.title = dark ? "Tema claro" : "Tema oscuro";
        button.innerHTML = dark
            ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.7 13A8.5 8.5 0 0 1 11 3.3 8.7 8.7 0 1 0 20.7 13Z"></path></svg>'
            : '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path></svg>';
        writeStorage(themeKey, dark ? "dark" : "light");
    }

    byId("theme-toggle").addEventListener("click", () => {
        setTheme(app.classList.contains("is-dark") ? "light" : "dark");
    });
    const savedTheme = readStorage(themeKey);
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches || false;
    setTheme(savedTheme === "dark" || (!savedTheme && prefersDark) ? "dark" : "light");

    function setBearChecking(active, progress = null) {
        if (riveInputs.checking) riveInputs.checking.value = Boolean(active);
        if (riveInputs.look && progress !== null) riveInputs.look.value = progress * 100;
    }

    function setBearHands(active) {
        active = Boolean(active);
        if (bearHandsUp && !active) bearHandsDownAt = performance.now();
        bearHandsUp = active;
        if (riveInputs.hands) riveInputs.hands.value = Boolean(active);
    }

    function fireBearTrigger(trigger) {
        if (bearHandsUp) setBearHands(false);
        const wait = riveInputs.hands && !reducedMotion
            ? Math.max(0, bearHandsDownAt + 1900 - performance.now())
            : 0;
        return new Promise(resolve => window.setTimeout(() => window.requestAnimationFrame(() => {
            try { if (trigger && typeof trigger.fire === "function") trigger.fire(); } catch (_) { /* Keep login usable if the animation machine changes. */ }
            resolve();
        }), wait));
    }

    function startBear() {
        if (!window.rive) {
            if (riveScriptLoading) return;
            riveScriptLoading = true;
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/@rive-app/canvas@2.21.6/rive.js";
            script.async = true;
            script.onload = () => startBear();
            script.onerror = () => console.warn("Cotix360 bear runtime unavailable");
            document.head.appendChild(script);
            return;
        }
        const canvas = byId("bear-canvas");
        if (!canvas) return;
        try {
            const teddyNumber = Math.random() < 0.5 ? 1 : 2;
            riveInstance = new window.rive.Rive({
                src: `./assets/resources/login-teddy${teddyNumber}.riv`,
                canvas,
                stateMachines: "Login Machine",
                autoplay: true,
                layout: new window.rive.Layout({
                    fit: window.rive.Fit.Cover,
                    alignment: window.rive.Alignment.Center
                }),
                onLoad: () => {
                    riveInstance.resizeDrawingSurfaceToCanvas();
                    (riveInstance.stateMachineInputs("Login Machine") || []).forEach(input => {
                        if (input.name === "isChecking") riveInputs.checking = input;
                        else if (input.name === "numLook") riveInputs.look = input;
                        else if (input.name === "isHandsUp") riveInputs.hands = input;
                        else if (input.name === "trigSuccess") riveInputs.success = input;
                        else if (input.name === "trigFail") riveInputs.fail = input;
                    });
                },
                onLoadError: error => console.warn("Cotix360 bear animation unavailable", error)
            });
            let resizeTimer;
            window.addEventListener("resize", () => {
                window.clearTimeout(resizeTimer);
                resizeTimer = window.setTimeout(() => riveInstance?.resizeDrawingSurfaceToCanvas(), 120);
            });
        } catch (error) {
            console.warn("Cotix360 bear animation unavailable", error);
        }
    }
    startBear();

    function updateVerification(progress) {
        const pct = Math.max(0, Math.min(1, progress));
        verificationStep.style.setProperty("--progress", `${Math.round(pct * 100)}%`);
        verifyButton.style.setProperty("--progress", `${Math.round(pct * 100)}%`);
        document.querySelectorAll("[data-progress-step]").forEach(step => {
            const index = Number(step.dataset.progressStep || 0);
            step.classList.toggle("is-complete", isVerified || pct >= (index + 1) / 3);
            step.classList.toggle("is-current", !isVerified && pct >= index / 3 && pct < (index + 1) / 3);
        });
    }

    function showLoginStep() {
        byId("step-indicator-verify").classList.remove("is-active");
        byId("step-indicator-verify").classList.add("is-complete");
        byId("step-indicator-verify").removeAttribute("aria-current");
        byId("step-indicator-login").classList.add("is-active");
        byId("step-indicator-login").setAttribute("aria-current", "step");
        byId("step-number").textContent = "02";
        byId("step-name").textContent = "Ingreso";
        verificationStep.hidden = true;
        loginForm.hidden = false;
        byId("form-title").textContent = readStorage(rememberedUserKey) ? "Hola de nuevo" : "Ingresa a Cotix360";
        window.setTimeout(() => (userInput.value ? passwordInput : userInput).focus(), 70);
    }

    function completeVerification() {
        if (isVerified) return;
        isVerified = true;
        verifyButton.disabled = true;
        verifyButton.classList.remove("is-pressed");
        verificationStep.classList.remove("is-pressing");
        verificationStep.classList.add("is-complete");
        verifyLabel.textContent = "Verificación completada";
        verifyMessage.textContent = "Tu acceso está listo. Continúa con tus credenciales.";
        byId("verify-help").textContent = "Verificación completada correctamente";
        verificationLive.textContent = "Verificación completada. Ya puedes ingresar tus credenciales.";
        updateVerification(1);
        setBearChecking(false, 1);
        window.setTimeout(showLoginStep, reducedMotion ? 180 : 520);
    }

    function animateHold(now) {
        if (!holdStartedAt || isVerified) return;
        const progress = Math.min(1, (now - holdStartedAt) / holdDuration);
        updateVerification(progress);
        setBearChecking(true, progress);
        if (progress >= 1) {
            completeVerification();
            holdFrame = 0;
            return;
        }
        holdFrame = window.requestAnimationFrame(animateHold);
    }

    function startHold(event) {
        if (isVerified || isSubmitting || holdStartedAt) return;
        if (event?.button !== undefined && event.button !== 0) return;
        event?.preventDefault();
        pointerId = event?.pointerId ?? null;
        try { if (pointerId !== null) verifyButton.setPointerCapture(pointerId); } catch (_) { /* Pointer capture is optional. */ }
        holdStartedAt = performance.now();
        verifyButton.classList.add("is-pressed");
        verificationStep.classList.add("is-pressing");
        verifyLabel.textContent = "Verificando… mantén presionado";
        verifyMessage.textContent = "Estamos preparando una conexión segura.";
        verificationLive.textContent = "Verificación en progreso. Mantén presionado.";
        holdFrame = window.requestAnimationFrame(animateHold);
    }

    function stopHold() {
        if (!holdStartedAt || isVerified) return;
        holdStartedAt = 0;
        if (holdFrame) window.cancelAnimationFrame(holdFrame);
        holdFrame = 0;
        pointerId = null;
        verifyButton.classList.remove("is-pressed");
        verificationStep.classList.remove("is-pressing");
        verifyLabel.textContent = "Mantén presionado para verificar";
        verifyMessage.textContent = "Mantén presionado para preparar tu acceso seguro.";
        verificationLive.textContent = "La verificación se pausó. Mantén presionado hasta completarla.";
        updateVerification(0);
        setBearChecking(false, 0);
    }

    verifyButton.addEventListener("pointerdown", startHold);
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(type => verifyButton.addEventListener(type, stopHold));
    verifyButton.addEventListener("keydown", event => {
        if ([" ", "Enter"].includes(event.key)) {
            event.preventDefault();
            if (!event.repeat) startHold(event);
        }
    });
    verifyButton.addEventListener("keyup", event => {
        if ([" ", "Enter"].includes(event.key)) {
            event.preventDefault();
            stopHold();
        }
    });
    verifyButton.addEventListener("blur", stopHold);
    verifyButton.addEventListener("contextmenu", event => event.preventDefault());
    document.addEventListener("visibilitychange", () => { if (document.hidden) stopHold(); });

    const rememberedUser = readStorage(rememberedUserKey);
    if (rememberedUser) {
        userInput.value = rememberedUser;
        rememberUser.checked = true;
    }

    userInput.addEventListener("focus", () => {
        setBearChecking(true, Math.min(1, userInput.value.length / 32));
    });
    userInput.addEventListener("input", () => {
        setBearChecking(true, Math.min(1, userInput.value.length / 32));
        clearLoginError();
    });
    userInput.addEventListener("blur", () => setBearChecking(false));
    passwordInput.addEventListener("focus", () => setBearHands(passwordInput.type === "password"));
    passwordInput.addEventListener("blur", () => setBearHands(false));
    passwordInput.addEventListener("input", clearLoginError);

    byId("toggle-password").addEventListener("click", event => {
        const visible = passwordInput.type === "password";
        passwordInput.type = visible ? "text" : "password";
        const button = event.currentTarget;
        button.setAttribute("aria-pressed", String(visible));
        button.setAttribute("aria-label", visible ? "Ocultar contraseña" : "Mostrar contraseña");
        button.innerHTML = visible
            ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.9 4.2A10 10 0 0 1 12 4c6.4 0 10 8 10 8a17 17 0 0 1-2.2 3.2M6.6 6.6A17 17 0 0 0 2 12s3.6 8 10 8a9.7 9.7 0 0 0 5.4-1.6"></path><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M2 2l20 20"></path></svg>'
            : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
        if (document.activeElement === passwordInput) setBearHands(!visible);
    });

    const updateCapsLock = event => {
        if (typeof event.getModifierState === "function") capsLockHint.hidden = !event.getModifierState("CapsLock");
    };
    passwordInput.addEventListener("keydown", updateCapsLock);
    passwordInput.addEventListener("keyup", updateCapsLock);
    passwordInput.addEventListener("blur", () => { capsLockHint.hidden = true; });

    function showLoginError(message) {
        loginError.textContent = message;
        loginError.classList.add("is-visible");
        passwordInput.setAttribute("aria-invalid", "true");
        setBearChecking(false);
        setBearHands(false);
        fireBearTrigger(riveInputs.fail);
    }

    function clearLoginError() {
        loginError.textContent = "";
        loginError.classList.remove("is-visible");
        passwordInput.removeAttribute("aria-invalid");
        userInput.removeAttribute("aria-invalid");
    }

    function setSubmitting(submitting, label = "Ingresar") {
        isSubmitting = submitting;
        userInput.disabled = submitting;
        passwordInput.disabled = submitting;
        loginSubmit.disabled = submitting;
        loginSubmit.innerHTML = submitting
            ? `<span class="login-spinner" aria-hidden="true"></span><span>${label}</span>`
            : `<span id="login-submit-label">Ingresar</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7"></path></svg>`;
    }

    function loadRecaptcha() {
        if (!captchaSiteKey || window.grecaptcha) return Promise.resolve();
        if (recaptchaLoader) return recaptchaLoader;
        recaptchaLoader = new Promise(resolve => {
            const script = document.createElement("script");
            script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(captchaSiteKey)}`;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => resolve();
            document.head.appendChild(script);
            window.setTimeout(resolve, 4000);
        });
        return recaptchaLoader;
    }

    async function getCaptchaToken() {
        if (!captchaSiteKey) return "";
        await loadRecaptcha();
        if (!window.grecaptcha) return "";
        try {
            await new Promise(resolve => window.grecaptcha.ready(resolve));
            return await window.grecaptcha.execute(captchaSiteKey, { action: "login" });
        } catch (error) {
            console.warn("reCAPTCHA could not provide a token", error);
            return "";
        }
    }

    function showBlockCountdown(seconds) {
        if (lockInterval) window.clearInterval(lockInterval);
        let remaining = Math.max(1, Number(seconds) || 0);
        setSubmitting(true, `Bloqueado ${formatCountdown(remaining)}`);
        loginSubmit.innerHTML = `<span>Bloqueado ${formatCountdown(remaining)}</span>`;
        lockInterval = window.setInterval(() => {
            remaining -= 1;
            if (remaining <= 0) {
                window.clearInterval(lockInterval);
                lockInterval = null;
                setSubmitting(false);
                return;
            }
            loginSubmit.innerHTML = `<span>${`Bloqueado ${formatCountdown(remaining)}`}</span>`;
        }, 1000);
    }

    function formatCountdown(seconds) {
        const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${minutes}:${secs}`;
    }

    loginForm.addEventListener("submit", async event => {
        event.preventDefault();
        if (isSubmitting) return;
        if (!isVerified) {
            showLoginStep();
            return;
        }

        const username = userInput.value.trim();
        const password = passwordInput.value.trim();
        if (!username || !password) {
            if (!username) userInput.setAttribute("aria-invalid", "true");
            showLoginError("Ingresa tu usuario y contraseña.");
            (username ? passwordInput : userInput).focus();
            return;
        }

        clearLoginError();
        setSubmitting(true, "Ingresando...");
        setBearHands(false);
        setBearChecking(true);

        const formData = new FormData();
        formData.append("usuario", username);
        formData.append("password", password);
        try {
            const captchaToken = await getCaptchaToken();
            if (captchaToken) formData.append("g-recaptcha-response", captchaToken);
            const response = await fetch("controller/acceso.php", {
                method: "POST",
                body: formData,
                credentials: "same-origin"
            });
            const data = await response.json().catch(() => ({}));
            if (data.ok) {
                if (rememberUser.checked) writeStorage(rememberedUserKey, username);
                else writeStorage(rememberedUserKey, null);
                byId("form-title").textContent = "¡Bienvenido!";
                byId("form-subtitle").textContent = "Abriendo tu espacio de trabajo…";
                loginSubmit.innerHTML = "Acceso correcto";
                loginSubmit.classList.add("is-success");
                let redirected = false;
                const redirect = () => {
                    if (redirected) return;
                    redirected = true;
                    window.location.href = "home.php";
                };
                fireBearTrigger(riveInputs.success).then(() => window.setTimeout(redirect, reducedMotion ? 350 : 800));
                window.setTimeout(redirect, 5000);
                return;
            }

            setSubmitting(false);
            showLoginError(data.message || "Usuario o contraseña incorrectos.");
            if (Number(data.blocked_seconds) > 0) showBlockCountdown(data.blocked_seconds);
            else window.setTimeout(() => {
                if (!passwordInput.disabled && document.activeElement !== passwordInput) {
                    passwordInput.focus();
                    passwordInput.select();
                }
            }, reducedMotion ? 0 : 350);
        } catch (error) {
            console.error("Cotix360 login request failed", error);
            setSubmitting(false);
            showLoginError("No se pudo conectar con el servidor. Intenta nuevamente.");
        }
    });

    if (isVerified) showLoginStep();
    window.cotixLoginReady = true;
})();
