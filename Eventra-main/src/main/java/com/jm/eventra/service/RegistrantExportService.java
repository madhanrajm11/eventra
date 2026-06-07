package com.jm.eventra.service;

import com.jm.eventra.dto.response.RegistrantResponse;
import com.jm.eventra.exception.BusinessException;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class RegistrantExportService {

    private String csv(String value){
        if (value == null) return "";
        String v = value.replace("\"","\"\"");
        if (v.contains(",") || v.contains("\n") || v.contains("\r") || v.contains("\"")){
            return "\"" + v + "\"";
        }
        return v;
    }

    public byte[] toCsvBytes(List<RegistrantResponse> registrants){
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("name,email,department,year,designation\n");

        for (RegistrantResponse registrant : registrants){
            stringBuilder.append(csv(registrant.name())).append(',')
                    .append(csv(registrant.email())).append(',')
                    .append(csv(registrant.institutionName())).append(',')
                    .append(csv(registrant.department())).append(',')
                    .append(registrant.year() == null ? "" : registrant.year()).append(',')
                    .append(csv(registrant.designation()))
                    .append('\n');
        }

        return stringBuilder.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] toXlsBytes(List<RegistrantResponse> registrants){
        try (XSSFWorkbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()){

            Sheet sheet = workbook.createSheet("Registrants");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Name");
            header.createCell(1).setCellValue("Email");
            header.createCell(2).setCellValue("Institution");
            header.createCell(3).setCellValue("Department");
            header.createCell(4).setCellValue("Year");
            header.createCell(5).setCellValue("Designation");

            int rowIdx = 1;
            for (RegistrantResponse registrant : registrants){
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(registrant.name() == null ? "" : registrant.name());
                row.createCell(1).setCellValue(registrant.email() == null ? "" : registrant.email());
                row.createCell(2).setCellValue(registrant.institutionName() == null ? "" : registrant.institutionName());
                row.createCell(3).setCellValue(registrant.department() == null ? "" : registrant.department());
                row.createCell(4).setCellValue(registrant.year() == null ? "" : String.valueOf(registrant.year()));
                row.createCell(5).setCellValue(registrant.designation() == null ? "" : registrant.designation());
            }

            for (int i = 0; i < 6 ; i++) sheet.autoSizeColumn(i);

            workbook.write(outputStream);
            return outputStream.toByteArray();


        } catch (IOException e){
            throw new BusinessException("Failed to generate XLXS", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
