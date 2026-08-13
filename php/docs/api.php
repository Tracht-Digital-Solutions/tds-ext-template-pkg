<?php
/**
 * API documentation for this module's routes — consumed through `ApiDocSource`
 * and rendered in the admin frontend's API reference (`GET /wiki.json`).
 *
 * KEEP THIS FILE WHEN CLONING. Every route the module mounts needs an entry
 * here, and `php/tests/TemplateApiDocsTest.php` asserts both directions: a route
 * without a description and a description without a route both fail the suite.
 * That is the point — prose next to code rots, and a reference full of
 * confident, wrong detail is worse than the bare route list it replaced.
 *
 * `pattern` must match the Slim pattern in `register()` VERBATIM, inline regex
 * included (`/template/items/{id:[0-9]+}`): it is the join key for the route
 * introspection, so a prettified path silently produces an orphan doc AND an
 * undocumented route rather than an error.
 *
 * Fields: `method`, `pattern`, `summary` (one line, stands alone — it is what
 * the collapsed row shows), optional `description`, `tag` (sub-heading within
 * the module), `auth` (`public`|`session`|`permission`|`admin`|`token`),
 * `permission` (must exist in the module's `permissions()`), `params`
 * (`in` = `path`|`query`|`body`|`header`) and `responses`.
 */

declare(strict_types=1);

return [
    [
        'method' => 'GET',
        'pattern' => '/template/summary',
        'summary' => 'Kennzahl für das Dashboard-Widget',
        'description' => 'Die `dataEndpoint`-Route aus dem Manifest. Ersetze sie durch das, '
            . 'was dein Modul wirklich anbietet.',
        'permission' => 'template:read',
        'responses' => [
            ['status' => 200, 'description' => '`{ok: true}`'],
        ],
    ],
];
