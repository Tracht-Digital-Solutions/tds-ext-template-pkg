<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

/**
 * TEMPLATE migration. The class name MUST be prefixed with your module id
 * (here `Template*`): the base API's in-process auto-migrator includes every
 * module's migrations into ONE PHP process, so a reused class name is an
 * uncatchable fatal redeclaration.
 *
 * Rename the file AND the class together, and keep them in sync: Phinx derives
 * the expected class from the file name (drop the version prefix, `ucwords` on
 * `_`), so `20260901000001_template_create_example.php` ⇒ `TemplateCreateExample`.
 * A mismatch throws `Could not find class …` while the migration set is scanned,
 * which aborts the run for EVERY composed extension, not just yours — so the
 * module prefix goes first in the file name too, never `create_template_example`.
 *
 * **Give your clone its own version band.** Every enabled extension shares ONE
 * `phinxlog`, so a reused numeric prefix collides there and Phinx aborts — and
 * an aborted scan means NO extension migrates, not just yours. This file used to
 * carry `20260713000001`, the same prefix as `tds-ext-time-tracker-pkg`; harmless
 * only because the template is never enabled, but every clone inherited the
 * collision. Bands in use: `202607*` and `202608*`. Pick a fresh date.
 */
final class TemplateCreateExample extends AbstractMigration
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
