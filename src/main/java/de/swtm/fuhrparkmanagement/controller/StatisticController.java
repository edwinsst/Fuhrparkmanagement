package de.swtm.fuhrparkmanagement.controller;

import de.swtm.fuhrparkmanagement.api.StatisticsApi;
import de.swtm.fuhrparkmanagement.model.UserStatisticDto;
import de.swtm.fuhrparkmanagement.service.StatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class StatisticController implements StatisticsApi {

    private final StatisticService statisticService;

    @Override
    public ResponseEntity<List<UserStatisticDto>> listAll(Boolean currentMonth) {
        try {
            return ResponseEntity.ok(statisticService.getAllStatistics(currentMonth));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @Override
    public ResponseEntity<UserStatisticDto> find(Long id, Boolean currentMonth) {
        try {
            return ResponseEntity.ok(statisticService.getStatistic(String.valueOf(id), currentMonth));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
