<?php
declare(strict_types=1);

namespace Tds\Ext\Template;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Tds\Frontend\Contract\AbstractModule;
use Tds\Frontend\Contract\ApiDocSource;
use Tds\Frontend\Contract\PermissionDef;

/**
 * TEMPLATE backend Module. Clone + rename:
 *   - the namespace (Tds\Ext\Template → your module namespace)
 *   - the id ("template")
 *   - the migration class prefix (Template*)
 * Delete the slots (migrations/permissions/settings/routes) you don't use.
 */
final class TemplateModule extends AbstractModule implements ApiDocSource
{
    public function id(): string
    {
        return 'template';
    }

    public function register(App $app): void
    {
        // Widget data endpoint (matches the manifest's WidgetManifest.dataEndpoint).
        $app->get('/template/summary', function (Request $request, Response $response): Response {
            $response->getBody()->write(json_encode(['ok' => true], JSON_THROW_ON_ERROR));
            return $response->withHeader('Content-Type', 'application/json');
        });
    }

    /** @return string[] */
    public function migrations(): array
    {
        return [__DIR__ . '/../db/migrations'];
    }

    /** @return PermissionDef[] */
    public function permissions(): array
    {
        return [new PermissionDef('template:read', 'Vorlage ansehen', 'template')];
    }

    /**
     * Route documentation for the admin frontend's API reference. Kept in its
     * own file so the prose does not sit in the middle of the wiring.
     *
     * @return list<array<string, mixed>>
     */
    public function apiDocs(): array
    {
        return require __DIR__ . '/../docs/api.php';
    }
}
