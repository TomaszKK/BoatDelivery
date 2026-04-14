package p.lodz.pl.model.audit;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import p.lodz.pl.model.ControlledEntity;

@ApplicationScoped
public class AuditListener {

    @Inject
    SecurityIdentity securityIdentity;

    @PrePersist
    public void onPrePersist(ControlledEntity entity) {
        String currentUser = getCurrentUser();
        entity.createdBy = currentUser;
        entity.updatedBy = currentUser;
    }

    @PreUpdate
    public void onPreUpdate(ControlledEntity entity) {
        entity.updatedBy = getCurrentUser();
    }

    private String getCurrentUser() {
        try {
            if (securityIdentity != null && !securityIdentity.isAnonymous()) {
                return securityIdentity.getPrincipal().getName();
            }
        } catch (jakarta.enterprise.context.ContextNotActiveException e) {
            return "system";
        } catch (Exception e) {
            return "system";
        }
        return "system";
    }
}