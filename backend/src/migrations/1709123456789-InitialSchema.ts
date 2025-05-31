import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm";

export class InitialSchema1709123456789 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create cities table
        await queryRunner.createTable(
            new Table({
                name: "cities",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                        isUnique: true
                    }
                ]
            }),
            true
        );

        // Create index on city name
        await queryRunner.createIndex(
            "cities",
            new TableIndex({
                name: "IDX_CITY_NAME",
                columnNames: ["name"]
            })
        );

        // Create users table
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "first_name",
                        type: "varchar",
                        length: "100"
                    },
                    {
                        name: "last_name",
                        type: "varchar",
                        length: "100"
                    },
                    {
                        name: "birth_date",
                        type: "timestamp",
                        precision: 0
                    },
                    {
                        name: "city_id",
                        type: "int"
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    }
                ]
            }),
            true
        );

        // Create indexes on user names
        await queryRunner.createIndex(
            "users",
            new TableIndex({
                name: "IDX_USER_FIRST_NAME",
                columnNames: ["first_name"]
            })
        );

        await queryRunner.createIndex(
            "users",
            new TableIndex({
                name: "IDX_USER_LAST_NAME",
                columnNames: ["last_name"]
            })
        );

        // Create foreign key relationship
        await queryRunner.createForeignKey(
            "users",
            new TableForeignKey({
                name: "FK_USERS_CITY",
                columnNames: ["city_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "cities",
                onDelete: "RESTRICT"
            })
        );

        // Insert initial cities
        await queryRunner.query(`
            INSERT INTO cities (name) VALUES 
            ('TEL_AVIV'),
            ('JERUSALEM'),
            ('HAIFA'),
            ('BEER_SHEVA'),
            ('NETANYA')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key
        const usersTable = await queryRunner.getTable("users");
        const foreignKey = usersTable?.foreignKeys.find(fk => fk.name === "FK_USERS_CITY");
        if (foreignKey) {
            await queryRunner.dropForeignKey("users", foreignKey);
        }

        // Drop indexes
        await queryRunner.dropIndex("users", "IDX_USER_FIRST_NAME");
        await queryRunner.dropIndex("users", "IDX_USER_LAST_NAME");
        await queryRunner.dropIndex("cities", "IDX_CITY_NAME");

        // Drop tables
        await queryRunner.dropTable("users");
        await queryRunner.dropTable("cities");
    }
} 