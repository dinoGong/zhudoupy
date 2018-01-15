Raven.config(SENTRY_PUBLIC_DSN).install()

jQuery(document).ready(function($) {
    // Capture all AJAX errors in Sentry
    $(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
        Raven.captureMessage(thrownError || jqXHR.statusText, {
            extra: {
                type: ajaxSettings.type,
                url: ajaxSettings.url,
                data: ajaxSettings.data,
                status: jqXHR.status,
                error: thrownError || jqXHR.statusText,
                response: jqXHR.responseText.substring(0, 100)
            }
        });
    });
});
