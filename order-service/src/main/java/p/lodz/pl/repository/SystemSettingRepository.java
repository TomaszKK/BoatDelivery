package p.lodz.pl.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import p.lodz.pl.model.SystemSetting;

@ApplicationScoped
public class SystemSettingRepository implements PanacheRepository<SystemSetting> {
}