package de.swtm.fuhrparkmanagement.service;

import de.swtm.fuhrparkmanagement.model.*;
import de.swtm.fuhrparkmanagement.repository.RideReservationRepository;
import lombok.RequiredArgsConstructor;
import netscape.javascript.JSObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticService {

    private final RideReservationRepository rideReservationRepository;

    private final UserService userService;

    private int getReservationsAmount(String userId, boolean currentMonth, Iterable<RideReservation> reservations) {
        int result = 0;
        LocalDate currentDate = LocalDate.now();
        for (RideReservation reservation : reservations) {
            if (reservation.getDeletedDate() != null || !reservation.getUserId().equals(userId)) {
                continue;
            }
            Ride ride = reservation.getRide();
            OffsetDateTime startDate = ride.getStartDate();
            OffsetDateTime endDate = ride.getEndDate();
            if (!currentMonth) {
                result++;
                continue;
            }
            if ((startDate.getYear() == currentDate.getYear() && startDate.getMonthValue() == currentDate.getMonthValue())
                || (endDate.getYear() == currentDate.getYear() && endDate.getMonthValue() == currentDate.getMonthValue()))
            {
                result++;
            }
        }
        return result;
    }

    private UserStatisticDto getStatistic(User user, boolean currentMonth, Iterable<RideReservation> reservations) {
        String userId = String.valueOf(user.getId());
        UserStatisticDto userStatisticDto = new UserStatisticDto();
        userStatisticDto.setUserId(userId);
        userStatisticDto.setName(user.getGivenName() + " " + user.getSurname());
        userStatisticDto.setAmountReservations(getReservationsAmount(userId, currentMonth, reservations));
        return userStatisticDto;
    }

    public UserStatisticDto getStatistic(String userId, boolean currentMonth) throws URISyntaxException, IOException,
            InterruptedException
    {
        return getStatistic(userService.getUser(userId), currentMonth, rideReservationRepository.findAll());
    }

    public List<UserStatisticDto> getAllStatistics(boolean currentMonth) throws URISyntaxException, IOException,
            InterruptedException
    {
        Iterable<RideReservation> reservations = rideReservationRepository.findAll();
        return userService.getUsers().stream()
                .map(user -> getStatistic(user, currentMonth, reservations))
                .sorted(Comparator.comparingInt(UserStatisticDto::getAmountReservations).reversed())
                .toList();
    }
}
