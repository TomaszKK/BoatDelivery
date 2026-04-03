package p.lodz.pl.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "system_settings")
public class SystemSetting extends ControlledEntity {

    @Column(name = "setting_key", unique = true, nullable = false)
    public String settingKey;

    @Column(name = "setting_value", nullable = false)
    public String settingValue;
}