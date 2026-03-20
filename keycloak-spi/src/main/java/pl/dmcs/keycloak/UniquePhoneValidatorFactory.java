package pl.dmcs.keycloak;

import org.keycloak.Config;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.validate.Validator;
import org.keycloak.validate.ValidatorFactory;

public class UniquePhoneValidatorFactory implements ValidatorFactory {

    @Override
    public String getId() {
        return UniquePhoneValidator.ID;
    }

    @Override
    public Validator create(KeycloakSession session) {
        return new UniquePhoneValidator();
    }

    @Override
    public void init(Config.Scope config) {}

    @Override
    public void postInit(KeycloakSessionFactory factory) {}

    @Override
    public void close() {}
}