<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

/**
 * TEMPLATE migration. The class name MUST be prefixed with your module id
 * (here `Template*`): the base API's in-process auto-migrator includes every
 * module's migrations into ONE PHP process, so a reused class name is an
 * uncatchable fatal redeclaration. Rename this file + class for your table.
 */
final class CreateTemplateExample extends AbstractMigration
{
    public function change(): void
    {
        $table = $this->table('template_example', ['signed' => false]);
        $table
            ->addColumn('name', 'string', ['limit' => 200])
            ->addColumn('created_at', 'datetime', ['default' => 'CURRENT_TIMESTAMP'])
            ->create();
    }
}
