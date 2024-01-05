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
        long id = rideReservation.getRide().getId();
        String purpose = rideReservation.getRide().getPurpose();
        String startAddress = rideReservation.getRide().getStartAddress();
        String destinationAddress = rideReservation.getRide().getDestinationAddress();
        String str = """
                BEGIN:VCALENDAR
                VERSION:2.0
                METHOD:PUBLISH
                BEGIN:VEVENT
                UID:slashDrive-%d
                CLASS:PUBLIC
                DESCRIPTION:Reservierung Fahrt: "%s"\\n von %s nach %s\\n
                DTSTART:%s
                DTEND:%s
                LOCATION:Stuttgart
                SUMMARY;LANGUAGE=en-us:Reservierung Fahrt: %s
                END:VEVENT
                END:VCALENDAR
                """;
        // ggf. /r/n instead of /n
        return String.format(str, id, purpose, startAddress, destinationAddress, startDate, endDate, purpose);
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
        long id = rideReservation.getRide().getId();
        String purpose = rideReservation.getRide().getPurpose();
        String startAddress = rideReservation.getRide().getStartAddress();
        String destinationAddress = rideReservation.getRide().getDestinationAddress();
        String str = """
                BEGIN:VCALENDAR
                VERSION:2.0
                METHOD:REQUEST
                BEGIN:VEVENT
                UID:slashDrive-%d
                CLASS:PUBLIC
                DESCRIPTION:Bearbeiten Fahrt: "%s"\\n von %s nach %s\\n
                DTSTART:%s
                DTEND:%s
                LOCATION:Stuttgart
                SUMMARY;LANGUAGE=en-us:Bearbeiten Fahrt: %s
                END:VEVENT
                END:VCALENDAR
                """;
        // ggf. /r/n instead of /n
        return String.format(str, id, purpose, startAddress, destinationAddress, startDate, endDate, purpose);
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
        long id = rideReservation.getRide().getId();
        String purpose = rideReservation.getRide().getPurpose();
        String startAddress = rideReservation.getRide().getStartAddress();
        String destinationAddress = rideReservation.getRide().getDestinationAddress();
        String str = """
                BEGIN:VCALENDAR
                VERSION:2.0
                METHOD:CANCEL
                BEGIN:VEVENT
                UID:slashDrive-%d
                CLASS:PUBLIC
                DESCRIPTION:Löschen Fahrt: "%s"\\n von %s nach %s\\n
                DTSTART:%s
                DTEND:%s
                LOCATION:Stuttgart
                SUMMARY;LANGUAGE=en-us:Löschen Fahrt: %s
                END:VEVENT
                END:VCALENDAR
                """;
        // ggf. /r/n instead of /n
        return String.format(str, id, purpose, startAddress, destinationAddress, startDate, endDate, purpose);
    }
}
