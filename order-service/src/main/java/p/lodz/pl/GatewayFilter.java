package p.lodz.pl;

import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

@Provider
@Priority(Priorities.AUTHENTICATION)
public class GatewayFilter implements ContainerRequestFilter {

    @Override
    public void filter(ContainerRequestContext requestContext) {
        String secret = requestContext.getHeaderString("X-Gateway-Secret");

        if (!"most-secret-header-value".equals(secret)) {
            requestContext.abortWith(Response.status(403).build());
        }
    }
}