package p.lodz.pl.client;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.annotation.ClientHeaderParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import p.lodz.pl.dto.UserDTO;

import java.util.List;

@RegisterRestClient(configKey = "user-service")
@Path("/api/user")
public interface UserServiceClient {

    @GET
    @Path("/internal/couriers")
    @Produces(MediaType.APPLICATION_JSON)
    @ClientHeaderParam(name = "X-Keycloak-Secret", value = "${internal.api.secret}")
    List<UserDTO> getCouriers();
}