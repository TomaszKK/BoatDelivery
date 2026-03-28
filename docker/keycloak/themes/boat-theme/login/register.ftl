<#import "template.ftl" as layout>
<@layout.registrationLayout; section>
    <#if section = "header">
        ${msg("registerTitle")}
    <#elseif section = "form">
        <form id="kc-register-form" class="${properties.kcFormClass!}" action="${url.registrationAction}" method="post">

            <style>
                .modern-error-text {
                    color: #c9190b;
                    font-size: 0.875rem;
                    margin-top: 0.35rem;
                    display: block;
                    font-weight: 500;
                }
                .modern-input-error {
                    border-bottom-color: #c9190b !important;
                    box-shadow: inset 0 -1px 0 0 #c9190b !important;
                }
                /* Styl dla czerwonej gwiazdki */
                .required {
                    color: #c9190b;
                    margin-left: 3px;
                    font-weight: bold;
                }

                /* --- Nowe style dla wyboru typu konta --- */
                .account-type-wrapper {
                    display: flex;
                    gap: 1rem;
                    margin-top: 0.5rem;
                }
                .account-type-card {
                    flex: 1;
                    cursor: pointer;
                    position: relative;
                }
                .account-type-card input[type="radio"] {
                    position: absolute;
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .account-type-card .card-content {
                    border: 2px solid #4f4f4f; /* Ciemniejsza ramka dopasowana do Twojego tła */
                    border-radius: 8px;
                    padding: 0.8rem 1rem;
                    text-align: center;
                    transition: all 0.2s ease;
                    color: #d2d2d2; /* Jasny tekst dla ciemnego motywu */
                    font-weight: 600;
                    background-color: transparent;
                }
                .account-type-card:hover .card-content {
                    border-color: #0066cc;
                }

                .account-type-card input[type="radio"]:checked + .card-content {
                    border-color: #0066cc;
                    background-color: #fff;
                    color: #0066cc;
                }
                .account-type-error .card-content {
                    border-color: #c9190b !important;
                }

                .form-action-spacer {
                    margin-bottom: 1.5rem;
                    margin-top: 1rem;
                }
                .form-action-spacer a {
                    color: #0066cc;
                    text-decoration: none;
                    font-size: 1rem;
                    transition: color 0.2s;
                    font-weight: bold;
                }
                .form-action-spacer a:hover {
                    color: #004c99;
                    text-decoration: underline;
                }
            </style>

            <#-- 1. LOGIN -->
            <#if !realm.registrationEmailAsUsername>
                <div class="${properties.kcFormGroupClass!}">
                    <div class="${properties.kcLabelWrapperClass!}">
                        <label for="username" class="${properties.kcLabelClass!}">${msg("username")}<span class="required">*</span></label>
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
                    <label for="email" class="${properties.kcLabelClass!}">${msg("email")}<span class="required">*</span></label>
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
                    <label for="firstName" class="${properties.kcLabelClass!}">${msg("firstName")}<span class="required">*</span></label>
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
                    <label for="lastName" class="${properties.kcLabelClass!}">${msg("lastName")}<span class="required">*</span></label>
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
                    <label for="user.attributes.phoneNumber" class="${properties.kcLabelClass!}">${msg("phoneNumber")}<span class="required">*</span></label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <#assign hasError = messagesPerField.existsError('user.attributes.phoneNumber', 'phoneNumber')>
                    <input type="tel" id="user.attributes.phoneNumber"
                           class="${properties.kcInputClass!} <#if hasError>modern-input-error</#if>"
                           name="user.attributes.phoneNumber"
                           value="${(register.formData['user.attributes.phoneNumber']!'')}" />

                    <#if hasError>
                        <span class="modern-error-text">
                            ${kcSanitize(messagesPerField.getFirstError('user.attributes.phoneNumber', 'phoneNumber'))?no_esc}
                        </span>
                    </#if>
                </div>
            </div>

            <#-- 6. HASŁA -->
            <#if passwordRequired>
                <div class="${properties.kcFormGroupClass!}">
                    <div class="${properties.kcLabelWrapperClass!}">
                        <label for="password" class="${properties.kcLabelClass!}">${msg("password")}<span class="required">*</span></label>
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
                        <label for="password-confirm" class="${properties.kcLabelClass!}">${msg("passwordConfirm")}<span class="required">*</span></label>
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
                    <label class="${properties.kcLabelClass!}">${msg("accountType")}<span class="required">*</span></label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <#assign selectedType = (register.formData['user.attributes.ACCOUNT_TYPE']!'CUSTOMER')>
                    <#assign typeHasError = messagesPerField.existsError('user.attributes.ACCOUNT_TYPE')>

                    <div class="account-type-wrapper">
                        <label class="account-type-card <#if typeHasError>account-type-error</#if>">
                            <input type="radio" name="user.attributes.ACCOUNT_TYPE" value="CUSTOMER" <#if selectedType == 'CUSTOMER'>checked</#if> required>
                            <div class="card-content">
                                ${msg("accountTypeCustomer")}
                            </div>
                        </label>

                        <label class="account-type-card <#if typeHasError>account-type-error</#if>">
                            <input type="radio" name="user.attributes.ACCOUNT_TYPE" value="COURIER" <#if selectedType == 'COURIER'>checked</#if> required>
                            <div class="card-content">
                                ${msg("accountTypeCourier")}
                            </div>
                        </label>
                    </div>

                    <#if typeHasError>
                        <span class="modern-error-text">${kcSanitize(messagesPerField.get('user.attributes.ACCOUNT_TYPE'))?no_esc}</span>
                    </#if>
                </div>
            </div>

            <#-- SEKCJA PRZYCISKÓW -->
            <div class="${properties.kcFormGroupClass!}">
                <#-- Zmiana: Dodana klasa form-action-spacer do kontroli odstępu -->
                <div id="kc-form-options" class="${properties.kcFormOptionsClass!} form-action-spacer">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                        <span><a href="${url.loginUrl}">${kcSanitize(msg("backToLogin"))?no_esc}</a></span>
                    </div>
                </div>

                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doRegister")}"/>
                </div>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>