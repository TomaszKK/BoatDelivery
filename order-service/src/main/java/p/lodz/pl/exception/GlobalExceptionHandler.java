package p.lodz.pl.exception;

import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;
import p.lodz.pl.dto.ErrorResponse;

import java.rmi.ServerException;
import java.time.Instant;

public class GlobalExceptionHandler {

    @ServerExceptionMapper
    public RestResponse<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                404,
                "Not Found",
                ex.getMessage(),
                Instant.now()
        );
        return RestResponse.status(Response.Status.NOT_FOUND, errorResponse);
    }

    @ServerExceptionMapper
    public RestResponse<ErrorResponse> handleBadRequest(BadRequestException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                400,
                "Bad Request",
                ex.getMessage(),
                Instant.now()
        );
        return RestResponse.status(Response.Status.BAD_REQUEST, errorResponse);
    }
}