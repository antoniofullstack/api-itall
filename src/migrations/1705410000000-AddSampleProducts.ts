import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSampleProducts1705410000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO products (name, description, price, category, stock, "imageUrl", created_at, updated_at)
            VALUES 
            ('Notebook Dell XPS 13', 'Notebook premium com processador Intel Core i7, 16GB RAM e SSD de 512GB', 8999.99, 'Notebooks', 10, NULL, NOW(), NOW()),
            ('Monitor LG 27"', 'Monitor IPS Full HD com taxa de atualização de 144Hz', 1499.99, 'Monitores', 15, NULL, NOW(), NOW()),
            ('Teclado Mecânico', 'Teclado mecânico RGB com switches blue', 299.99, 'Periféricos', 30, NULL, NOW(), NOW()),
            ('Mouse Gamer', 'Mouse gamer com sensor óptico de alta precisão', 199.99, 'Periféricos', 25, NULL, NOW(), NOW()),
            ('Headset Wireless', 'Headset sem fio com cancelamento de ruído', 599.99, 'Áudio', 20, NULL, NOW(), NOW()),
            ('SSD 1TB', 'SSD NVME com velocidade de leitura de até 7000MB/s', 799.99, 'Armazenamento', 40, NULL, NOW(), NOW()),
            ('Placa de Vídeo RTX 4070', 'Placa de vídeo para jogos em 4K', 4999.99, 'Placas de Vídeo', 5, NULL, NOW(), NOW()),
            ('Memória RAM 32GB', 'Kit de memória RAM DDR5 (2x16GB)', 899.99, 'Memórias', 30, NULL, NOW(), NOW()),
            ('Webcam HD', 'Webcam 1080p com microfone integrado', 249.99, 'Periféricos', 35, NULL, NOW(), NOW()),
            ('Roteador Wi-Fi 6', 'Roteador dual band com suporte a Wi-Fi 6', 699.99, 'Redes', 12, NULL, NOW(), NOW())
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM products`);
    }
}
