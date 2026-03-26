<#import "template.ftl" as layout>
<@layout.registrationLayout; section>
    <#if section = "header">
        Rejestracja konta
    <#elseif section = "form">
        <style>
            .modern-error-text {
                color: #c9190b; /* Czerwony kolor błędu */
                font-size: 0.875rem;
                margin-top: 0.35rem;
                display: block;
                font-weight: 500;
            }
            .modern-input-error {
                border-bottom-color: #c9190b !important;
                box-shadow: inset 0 -1px 0 0 #c9190b !important;
            }
        </style>

        <form id="kc-register-form" class="${properties.kcFormClass!}" action="${url.registrationAction}" method="post">

            <#-- 1. LOGIN -->
            <#if !realm.registrationEmailAsUsername>
                <div class="${properties.kcFormGroupClass!}">
                    <div class="${properties.kcLabelWrapperClass!}">
                        <label for="username" class="${properties.kcLabelClass!}">Login</label>
                    </div>
                    <div class="${properties.kcInputWrapperClass!}">
                        <input type="text" id="username" class="${properties.kcInputClass!} <#if messagesPerField.existsError('username')>modern-input-error</#if>" name="username" value="${(register.formData.username!'')}" autocomplete="username" />
                        <#if messagesPerField.existsError('username')>
                            <span class="modern-error-text">${kcSanitize(messagesPerField.get('username'))?no_esc}</span>
                        </#if>
                    </div>
                </div>
            </#if>

            <#-- 2. E-MAIL -->
            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="email" class="${properties.kcLabelClass!}">Adres e-mail</label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <input type="email" id="email" class="${properties.kcInputClass!} <#if messagesPerField.existsError('email')>modern-input-error</#if>" name="email" value="${(register.formData.email!'')}" autocomplete="email" />
                    <#if messagesPerField.existsError('email')>
                        <span class="modern-error-text">${kcSanitize(messagesPerField.get('email'))?no_esc}</span>
                    </#if>
                </div>
            </div>

            <#-- 3. IMIĘ -->
            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="firstName" class="${properties.kcLabelClass!}">Imię</label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <input type="text" id="firstName" class="${properties.kcInputClass!} <#if messagesPerField.existsError('firstName')>modern-input-error</#if>" name="firstName" value="${(register.formData.firstName!'')}" />
                    <#if messagesPerField.existsError('firstName')>
                        <span class="modern-error-text">${kcSanitize(messagesPerField.get('firstName'))?no_esc}</span>
                    </#if>
                </div>
            </div>

            <#-- 4. NAZWISKO -->
            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="lastName" class="${properties.kcLabelClass!}">Nazwisko</label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <input type="text" id="lastName" class="${properties.kcInputClass!} <#if messagesPerField.existsError('lastName')>modern-input-error</#if>" name="lastName" value="${(register.formData.lastName!'')}" />
                    <#if messagesPerField.existsError('lastName')>
                        <span class="modern-error-text">${kcSanitize(messagesPerField.get('lastName'))?no_esc}</span>
                    </#if>
                </div>
            </div>

            <#-- 5. NUMER TELEFONU -->
            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="user.attributes.phoneNumber" class="${properties.kcLabelClass!}">Numer telefonu</label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <input type="tel" id="user.attributes.phoneNumber" class="${properties.kcInputClass!} <#if messagesPerField.existsError('user.attributes.phoneNumber')>modern-input-error</#if>" name="user.attributes.phoneNumber" value="${(register.formData['user.attributes.phoneNumber']!'')}" />
                    <#if messagesPerField.existsError('user.attributes.phoneNumber')>
                        <span class="modern-error-text">${kcSanitize(messagesPerField.get('user.attributes.phoneNumber'))?no_esc}</span>
                    </#if>
                </div>
            </div>

            <#-- 6. HASŁA -->
            <#if passwordRequired>
                <div class="${properties.kcFormGroupClass!}">
                    <div class="${properties.kcLabelWrapperClass!}">
                        <label for="password" class="${properties.kcLabelClass!}">Hasło</label>
                    </div>
                    <div class="${properties.kcInputWrapperClass!}">
                        <input type="password" id="password" class="${properties.kcInputClass!} <#if messagesPerField.existsError('password')>modern-input-error</#if>" name="password" autocomplete="new-password"/>
                        <#if messagesPerField.existsError('password')>
                            <span class="modern-error-text">${kcSanitize(messagesPerField.get('password'))?no_esc}</span>
                        </#if>
                    </div>
                </div>

                <div class="${properties.kcFormGroupClass!}">
                    <div class="${properties.kcLabelWrapperClass!}">
                        <label for="password-confirm" class="${properties.kcLabelClass!}">Powtórz hasło</label>
                    </div>
                    <div class="${properties.kcInputWrapperClass!}">
                        <input type="password" id="password-confirm" class="${properties.kcInputClass!} <#if messagesPerField.existsError('password-confirm')>modern-input-error</#if>" name="password-confirm" />
                        <#if messagesPerField.existsError('password-confirm')>
                            <span class="modern-error-text">${kcSanitize(messagesPerField.get('password-confirm'))?no_esc}</span>
                        </#if>
                    </div>
                </div>
            </#if>

            <#-- 7. WYBÓR KONTA -->
            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="user.attributes.ACCOUNT_TYPE" class="${properties.kcLabelClass!}">Wybierz typ konta</label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <select id="user.attributes.ACCOUNT_TYPE" class="${properties.kcInputClass!} <#if messagesPerField.existsError('user.attributes.ACCOUNT_TYPE')>modern-input-error</#if>" name="user.attributes.ACCOUNT_TYPE" required>
                        <#-- Zatrzymanie wybranej opcji, jeśli walidacja hasła się nie powiedzie -->
                        <#assign selectedType = (register.formData['user.attributes.ACCOUNT_TYPE']!'CUSTOMER')>
                        <option value="CUSTOMER" <#if selectedType == 'CUSTOMER'>selected</#if>>Jestem Klientem</option>
                        <option value="COURIER" <#if selectedType == 'COURIER'>selected</#if>>Jestem Kurierem</option>
                    </select>
                    <#if messagesPerField.existsError('user.attributes.ACCOUNT_TYPE')>
                        <span class="modern-error-text">${kcSanitize(messagesPerField.get('user.attributes.ACCOUNT_TYPE'))?no_esc}</span>
                    </#if>
                </div>
            </div>

            <#-- RECAPTCHA (Ukryta, jeśli nie skonfigurowana, ale warto zostawić blok) -->
            <#if recaptchaRequired??>
                <div class="form-group">
                    <div class="${properties.kcInputWrapperClass!}">
                        <div class="g-recaptcha" data-size="compact" data-sitekey="${recaptchaSiteKey}"></div>
                    </div>
                </div>
            </#if>

            <#-- SEKCJA PRZYCISKÓW -->
            <div class="${properties.kcFormGroupClass!}">
                <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                        <span><a href="${url.loginUrl}">« Powrót do logowania</a></span>
                    </div>
                </div>

                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" type="submit" value="Zarejestruj się"/>
                </div>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>