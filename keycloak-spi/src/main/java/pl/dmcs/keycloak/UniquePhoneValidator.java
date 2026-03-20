package pl.dmcs.keycloak;

import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.validate.ValidationContext;
import org.keycloak.validate.ValidationError;
import org.keycloak.validate.Validator;
import org.keycloak.validate.ValidatorConfig;

import java.util.List;
import java.util.stream.Collectors;

public class UniquePhoneValidator implements Validator {

    public static final String ID = "unique-phone";

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

        if (phone == null || phone.trim().isEmpty()) {
            return context;
        }

        KeycloakSession session = context.getSession();
        RealmModel realm = session.getContext().getRealm();

        List<UserModel> existingUsers = session.users()
                .searchForUserByUserAttributeStream(realm, "phoneNumber", phone)
                .collect(Collectors.toList());

        UserModel currentUser = (UserModel) context.getAttributes().get(UserModel.class.getName());

        for (UserModel user : existingUsers) {
            if (currentUser == null || !user.getId().equals(currentUser.getId())) {
                context.addError(new ValidationError(ID, inputHint, "Ten numer telefonu jest już zarejestrowany."));
                return context;
            }
        }

        return context;
    }
}