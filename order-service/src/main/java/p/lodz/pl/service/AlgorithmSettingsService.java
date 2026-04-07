package p.lodz.pl.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import p.lodz.pl.model.SystemSetting;
import p.lodz.pl.model.enums.AlgorithmType;
import p.lodz.pl.repository.SystemSettingRepository;

@ApplicationScoped
public class AlgorithmSettingsService {

    private static final String ALGORITHM_KEY = "ACTIVE_ROUTING_ALGORITHM";
    private static final AlgorithmType DEFAULT_ALGORITHM = AlgorithmType.TIMEFOLD_ADVANCED;

    @Inject
    SystemSettingRepository settingRepository;

    public AlgorithmType getCurrentAlgorithm() {
        SystemSetting setting = settingRepository.find("settingKey", ALGORITHM_KEY).firstResult();

        if (setting == null) {
            return DEFAULT_ALGORITHM;
        }

        return AlgorithmType.valueOf(setting.settingValue);
    }

    @Transactional
    public void setCurrentAlgorithm(AlgorithmType newAlgorithm) {
        SystemSetting setting = settingRepository.find("settingKey", ALGORITHM_KEY).firstResult();

        if (setting == null) {
            setting = new SystemSetting();
            setting.settingKey = ALGORITHM_KEY;
        }

        setting.settingValue = newAlgorithm.name();

        settingRepository.persist(setting);
    }
}