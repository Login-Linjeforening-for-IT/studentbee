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

    if (req.url ~ "^/(api/login|api/callback|api/logout|api/token|login)(/.*)?$") {
        return (pass);
    }

    return (hash);
}

sub vcl_backend_response {
    unset beresp.http.Cache-Control;
    set beresp.http.Cache-Control = "login-cache, max-age=600";
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
