package de.swtm.fuhrparkmanagement.service;

import de.swtm.fuhrparkmanagement.model.RideReservation;
import org.springframework.stereotype.Service;

@Service
public class ICSService {

    public String generateNewEvent(RideReservation rideReservation) {

        // Convert dates from: 2023-12-27T11:11Z
        // to format: YYYYMMDDTHHMMSSZ
        // DTSTART;TZID=Europe/Berlin:19970714T133000
        String startDate = rideReservation.getRide().getStartDate().toString();
        startDate = startDate.replaceAll("-", "")
                .replaceAll(":", "")
                .replaceAll("Z", "00Z");
        String endDate = rideReservation.getRide().getEndDate().toString();
        endDate = endDate.replaceAll("-", "")
                .replaceAll(":", "")
                .replaceAll("Z", "00Z");
        String str = """
                BEGIN:VCALENDAR
                VERSION:2.0
                BEGIN:VEVENT
                CLASS:PUBLIC
                DESCRIPTION:Reservierung Fahrt: "%s"\\nDate and Time - Dec 27\\, 2023 7:00 AM to Dec 30\\, 2023 12:00 AM\\nVenue - Stuttgart\\nvon Ludwigshafen nach Stuttgart\\n
                DTSTART:%s
                DTEND:%s
                LOCATION:Stuttgart
                SUMMARY;LANGUAGE=en-us:Reservierung Fahrt: "Geschäftsreise"
                END:VEVENT
                END:VCALENDAR
                """;
        // ggf. /r/n instead of /n
        return String.format(str, rideReservation.getRide().getPurpose(), startDate, endDate);
    }
    public String generateUpdateEvent(RideReservation rideReservation) {

        // Convert dates from: 2023-12-27T11:11Z
        // to format: YYYYMMDDTHHMMSSZ
        // DTSTART;TZID=Europe/Berlin:19970714T133000
        String startDate = rideReservation.getRide().getStartDate().toString();
        startDate = startDate.replaceAll("-", "")
                .replaceAll(":", "")
                .replaceAll("Z", "00Z");
        String endDate = rideReservation.getRide().getEndDate().toString();
        endDate = endDate.replaceAll("-", "")
                .replaceAll(":", "")
                .replaceAll("Z", "00Z");
        // TODO: ics has to "recognize" that it's an update and what it has to update
        String str = """
                BEGIN:VCALENDAR
                VERSION:2.0
                BEGIN:VEVENT
                CLASS:PUBLIC
                DESCRIPTION:Reservierung Fahrt: "%s"\\nDate and Time - Dec 27\\, 2023 7:00 AM to Dec 30\\, 2023 12:00 AM\\nVenue - Stuttgart\\nvon Ludwigshafen nach Stuttgart\\n
                DTSTART:%s
                DTEND:%s
                LOCATION:Stuttgart
                SUMMARY;LANGUAGE=en-us:Reservierung Fahrt: "Geschäftsreise"
                END:VEVENT
                END:VCALENDAR
                """;
        // ggf. /r/n instead of /n
        return String.format(str, rideReservation.getRide().getPurpose(), startDate, endDate);
    }
    public String generateDeleteEvent(RideReservation rideReservation) {

        // Convert dates from: 2023-12-27T11:11Z
        // to format: YYYYMMDDTHHMMSSZ
        // DTSTART;TZID=Europe/Berlin:19970714T133000
        String startDate = rideReservation.getRide().getStartDate().toString();
        startDate = startDate.replaceAll("-", "")
                .replaceAll(":", "")
                .replaceAll("Z", "00Z");
        String endDate = rideReservation.getRide().getEndDate().toString();
        endDate = endDate.replaceAll("-", "")
                .replaceAll(":", "")
                .replaceAll("Z", "00Z");
        // TODO: ics has to "recognize" that it's should be deleted and which one
        String str = """
                BEGIN:VCALENDAR
                VERSION:2.0
                BEGIN:VEVENT
                CLASS:PUBLIC
                DESCRIPTION:Reservierung Fahrt: "%s"\\nDate and Time - Dec 27\\, 2023 7:00 AM to Dec 30\\, 2023 12:00 AM\\nVenue - Stuttgart\\nvon Ludwigshafen nach Stuttgart\\n
                DTSTART:%s
                DTEND:%s
                LOCATION:Stuttgart
                SUMMARY;LANGUAGE=en-us:Reservierung Fahrt: "Geschäftsreise"
                END:VEVENT
                END:VCALENDAR
                """;
        // ggf. /r/n instead of /n
        return String.format(str, rideReservation.getRide().getPurpose(), startDate, endDate);
    }
}
