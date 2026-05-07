vcl 4.0;

backend default {
    .host = "127.0.0.1";
    .port = "3001";
}

sub vcl_recv {
    if (req.method == "POST" || req.method == "PUT" || req.method == "HEAD" || req.method == "OPTIONS" || req.method == "DELETE") {
        return (pass);
    }

    if (req.url ~ "^/(edit)(/.*)?$") {
        return (pass);
    }

    if (req.url ~ "^/(profile)(/.*)?$") {
        return (pass);
    }

    if (req.url ~ "^/(api/auth|login)(/.*)?$") {
        return (pass);
    }
    
    if (req.http.Cookie && req.http.Cookie ~ "(^|; )access_token=") {
        set req.http.X-Authenticated = "1";
    } else if (req.http.Authorization) {
        set req.http.X-Authenticated = "1";
    } else {
        set req.http.X-Authenticated = "0";
    }

    return (hash);
}

sub vcl_hash {
    hash_data(req.http.host);
    hash_data(req.url);
    if (req.http.X-Authenticated) {
        hash_data(req.http.X-Authenticated);
    }
}

sub vcl_backend_response {
    if (beresp.status >= 300 && beresp.status < 400) {
        set beresp.uncacheable = true;
        set beresp.ttl = 0s;
        return (deliver);
    }

    if (beresp.http.Set-Cookie) {
        set beresp.uncacheable = true;
        set beresp.ttl = 0s;
        return (deliver);
    }

    unset beresp.http.Cache-Control;
    set beresp.ttl = 10m;
    return (deliver);
}

sub vcl_deliver {
    set resp.http.Via = "login-cache";

    if (obj.hits > 0) {
        set resp.http.X-Cache = "HIT";
    } else {
        set resp.http.X-Cache = "MISS";
    }

    return (deliver);
}
