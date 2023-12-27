package de.swtm.fuhrparkmanagement.service;

import de.swtm.fuhrparkmanagement.model.RideReservation;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@RequiredArgsConstructor
@Component
public class EmailService {
    private final JavaMailSender emailSender;

    public void sendSimpleMessage(
            String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("test@fuhrparkmanagement.com");
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
        helper.setFrom("test@fuhrparkmanagement.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text);
        helper.addAttachment("reservierung.ics", resource);
        emailSender.send(message);
    }

    public void sendNewReservationEmail(RideReservation rideReservation) throws MessagingException {
        String str = """
                Von: %s
                Bis: %s
                Purpose: %s
                """;
        str = String.format(str, rideReservation.getRide().getStartDate(), rideReservation.getRide().getEndDate(),
                rideReservation.getRide().getPurpose());

        String icsFileContent = icsService.generateEvent(rideReservation);
        sendMimeMessage(rideReservation.getUserId() + "@firma.de", "Neue Resevierung", str, icsFileContent);
    }
}