package pl.dmcs.keycloak;

import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.validate.ValidationContext;
import org.keycloak.validate.ValidationError;
import org.keycloak.validate.Validator;
import org.keycloak.validate.ValidatorConfig;

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class UniquePhoneValidator implements Validator {

    public static final String ID = "unique-phone";
    // Regex dla polskich numerów: +48 oraz 9 cyfr
    private static final Pattern POLISH_PHONE_PATTERN = Pattern.compile("^\\+48\\d{9}$");

    @Override
    public ValidationContext validate(Object input, String inputHint, ValidationContext context, ValidatorConfig config) {
        String phone = null;

        if (input instanceof List) {
            List<?> list = (List<?>) input;
            if (!list.isEmpty()) {
                phone = (String) list.get(0);
            }
        } else if (input instanceof String) {
            phone = (String) input;
        }

        // 1. Sprawdzenie czy pole jest puste (Required)
        if (phone == null || phone.trim().isEmpty()) {
            String fieldName = (inputHint != null) ? inputHint : "user.attributes.phoneNumber";
            context.addError(new ValidationError(ID, fieldName, "error-phoneNumber-empty"));
            return context;
        }

        // 2. Sprawdzenie formatu (+48...)
        if (!POLISH_PHONE_PATTERN.matcher(phone).matches()) {
            context.addError(new ValidationError(ID, inputHint, "error-phoneNumber-invalid-format"));
            return context;
        }

        // 3. Sprawdzenie unikalności w bazie
        KeycloakSession session = context.getSession();
        RealmModel realm = session.getContext().getRealm();

        List<UserModel> existingUsers = session.users()
                .searchForUserByUserAttributeStream(realm, "phoneNumber", phone)
                .collect(Collectors.toList());

        UserModel currentUser = (UserModel) context.getAttributes().get(UserModel.class.getName());

        for (UserModel user : existingUsers) {
            if (currentUser == null || !user.getId().equals(currentUser.getId())) {
                context.addError(new ValidationError(ID, inputHint, "error-phoneNumber-exists"));
                return context;
            }
        }

        return context;
    }
}