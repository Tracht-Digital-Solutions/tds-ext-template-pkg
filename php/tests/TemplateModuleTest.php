<?php
declare(strict_types=1);

namespace Tds\Ext\Template\Tests;

use PHPUnit\Framework\TestCase;
use Slim\Factory\AppFactory;
use Slim\Psr7\Factory\ServerRequestFactory;
use Tds\Ext\Template\TemplateModule;
use Tds\Panel\Contract\ModuleRegistry;

/**
 * TEMPLATE test: composes the module through a real ModuleRegistry + Slim app
 * and dispatches its route. Copy this pattern for your extension's routes.
 */
final class TemplateModuleTest extends TestCase
{
    public function testModuleRouteIsMounted(): void
    {
        $app = AppFactory::create();
        $app->addRoutingMiddleware();
        (new ModuleRegistry([new TemplateModule()]))->registerAll($app);

        $request = (new ServerRequestFactory())->createServerRequest('GET', '/template/summary');
        $response = $app->handle($request);

        self::assertSame(200, $response->getStatusCode());
        self::assertStringContainsString('ok', (string) $response->getBody());
    }

    public function testDeclaresPermission(): void
    {
        $ids = array_map(static fn ($p): string => $p->id, (new TemplateModule())->permissions());
        self::assertContains('template:read', $ids);
    }
}
