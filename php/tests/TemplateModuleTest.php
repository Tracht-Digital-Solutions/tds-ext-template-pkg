<?php
declare(strict_types=1);

namespace Tds\Ext\Template\Tests;

use Psr\Container\ContainerInterface;
use PHPUnit\Framework\TestCase;
use Slim\Factory\AppFactory;
use Slim\Psr7\Factory\ServerRequestFactory;
use Tds\Ext\Template\TemplateModule;
use Tds\Frontend\Contract\ModuleRegistry;
use Tds\Frontend\Contract\UserContext;

/**
 * TEMPLATE test: composes the module through a real ModuleRegistry + Slim app
 * and dispatches its route. Copy this pattern for your extension's routes.
 */
final class TemplateModuleTest extends TestCase
{
    private function appFor(UserContext $user): \Slim\App
    {
        // A minimal PSR-11 container: the composed app's is PHP-DI, but a
        // module only ever asks it for the contract's services.
        $container = new class ($user) implements ContainerInterface {
            public function __construct(private readonly UserContext $user)
            {
            }

            public function get(string $id): mixed
            {
                return $id === UserContext::class ? $this->user : throw new \RuntimeException("unbound: {$id}");
            }

            public function has(string $id): bool
            {
                return $id === UserContext::class;
            }
        };
        $app = AppFactory::create(null, $container);
        $app->addRoutingMiddleware();
        (new ModuleRegistry([new TemplateModule()]))->registerAll($app);
        return $app;
    }

    private function user(bool $auth, array $perms = []): UserContext
    {
        $user = $this->createMock(UserContext::class);
        $user->method('isAuthenticated')->willReturn($auth);
        $user->method('has')->willReturnCallback(static fn (string $p): bool => in_array($p, $perms, true));
        return $user;
    }

    public function testModuleRouteIsMounted(): void
    {
        $app = $this->appFor($this->user(true, ['template:read']));
        $response = $app->handle((new ServerRequestFactory())->createServerRequest('GET', '/template/summary'));

        self::assertSame(200, $response->getStatusCode());
        self::assertStringContainsString('ok', (string) $response->getBody());
    }

    public function testRouteChecksItsPermission(): void
    {
        $request = (new ServerRequestFactory())->createServerRequest('GET', '/template/summary');
        self::assertSame(401, $this->appFor($this->user(false))->handle($request)->getStatusCode());
        self::assertSame(403, $this->appFor($this->user(true))->handle($request)->getStatusCode());
    }

    public function testDeclaresPermission(): void
    {
        $ids = array_map(static fn ($p): string => $p->id, (new TemplateModule())->permissions());
        self::assertContains('template:read', $ids);
    }
}
