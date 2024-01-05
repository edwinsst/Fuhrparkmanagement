package de.swtm.fuhrparkmanagement.service;

import de.swtm.fuhrparkmanagement.model.RideReservation;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@RequiredArgsConstructor
@Component
public class EmailService {

    private final JavaMailSender emailSender;

    private final ICSService icsService;

    private final UserService userService;

    @Value("${spring.mail.from}")
    private String emailFrom;

    public void sendSimpleMessage(
            String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(emailFrom);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    public void sendMimeMessage(String to, String subject, String text, String icsFileContent)
            throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        ByteArrayResource resource = new ByteArrayResource(icsFileContent.getBytes(StandardCharsets.UTF_8));
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(emailFrom);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text);
        helper.addAttachment("reservierung.ics", resource);
        emailSender.send(message);
    }

    @Async
    public void sendNewReservationEmail(RideReservation rideReservation) throws Exception {
        String str = """
                Von: %s
                Bis: %s
                Purpose: %s
                """;
        str = String.format(str, rideReservation.getRide().getStartDate(), rideReservation.getRide().getEndDate(),
                rideReservation.getRide().getPurpose());

        String icsFileContent = icsService.generateNewEvent(rideReservation);
        String recipientEmail = userService.getUserEmail(rideReservation.getUserId());
        sendMimeMessage(recipientEmail, "Neue Resevierung", str, icsFileContent);
    }

    @Async
    public void sendUpdateReservationEmail(RideReservation rideReservation) throws Exception {
        String str = """
                Von: %s
                Bis: %s
                Purpose: %s
                """;
        str = String.format(str, rideReservation.getRide().getStartDate(), rideReservation.getRide().getEndDate(),
                rideReservation.getRide().getPurpose());

        String icsFileContent = icsService.generateUpdateEvent(rideReservation);
        String recipientEmail = userService.getUserEmail(rideReservation.getUserId());
        sendMimeMessage(recipientEmail, "Resevierung geaendert", str, icsFileContent);
    }

    @Async
    public void sendDeleteReservationEmail(RideReservation rideReservation) throws Exception {
        String str = """
                Von: %s
                Bis: %s
                Purpose: %s
                """;
        str = String.format(str, rideReservation.getRide().getStartDate(), rideReservation.getRide().getEndDate(),
                rideReservation.getRide().getPurpose());

        String icsFileContent = icsService.generateDeleteEvent(rideReservation);
        String recipientEmail = userService.getUserEmail(rideReservation.getUserId());
        sendMimeMessage(recipientEmail, "Resevierung geloescht", str, icsFileContent);
    }
}