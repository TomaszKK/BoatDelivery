package p.lodz.pl.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.hibernate.annotations.SoftDelete;

@Entity
@Table(name = "system_settings")
@SoftDelete
public class SystemSetting extends ControlledEntity {

    @Column(name = "setting_key", unique = true, nullable = false)
    public String settingKey;

    @Column(name = "setting_value", nullable = false)
    public String settingValue;
}