# Backend Documentation

Complete guide for understanding and extending the NestJS backend.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Module Structure](#module-structure)
- [Adding a New Module](#adding-a-new-module)
- [Permissions System](#permissions-system)
- [Database](#database)
- [Authentication](#authentication)
- [Internationalization](#internationalization)
- [API Response Format](#api-response-format)

## Architecture Overview

The backend follows NestJS best practices with a modular architecture:

```
back-end/
├── src/
│   ├── modules/              # Feature modules
│   │   ├── admins/          # Admin management
│   │   ├── users/           # User management
│   │   ├── auth/            # Authentication
│   │   ├── roles/           # Role & permissions
│   │   ├── projects/        # Projects
│   │   ├── tasks/           # Tasks
│   │   ├── ai-chat/         # AI Chat
│   │   ├── settings/        # App settings
│   │   ├── chat-sessions/   # Chat history & session management
│   │   ├── mcp/             # Model Context Protocol tools
│   │   └── helpers/         # Helper modules
│   │
│   ├── common/              # Shared utilities
│   │   ├── decorators/      # Custom decorators
│   │   │   └── permissions.decorator.ts
│   │   ├── guards/          # Route guards
│   │   │   └── permissions.guard.ts
│   │   ├── interceptors/    # Response interceptors
│   │   │   └── response.interceptor.ts
│   │   ├── filters/         # Exception filters
│   │   │   └── http-exception.filter.ts
│   │   └── utils/           # Utility functions
│   │
│   ├── database/            # Database configuration
│   │   ├── config/          # DB config
│   │   ├── seeders/         # Data seeders
│   │   └── scripts/         # Utility scripts
│   │
│   ├── i18n/                # Internationalization
│   │   ├── i18n.service.ts
│   │   └── translations/    # Translation files
│   │       ├── en/
│   │       └── ar/
│   │
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry point
│
└── docs/                    # API documentation
    ├── auth/
    ├── users/
    ├── admin/
    └── ...
```

## Module Structure

Each module follows this standard structure:

```
module-name/
├── dto/                      # Data Transfer Objects
│   ├── create-{entity}.dto.ts
│   ├── update-{entity}.dto.ts
│   └── {specific}.dto.ts
│
├── entities/                 # TypeORM Entities
│   └── {entity}.entity.ts
│
├── {module}.controller.ts    # HTTP endpoints
├── {module}.service.ts       # Business logic
└── {module}.module.ts        # Module definition
```

### Example: Admins Module

```typescript
// admins/admins.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]), // Register entity
    I18nModule, // For translations
    RolesModule, // For permissions check
  ],
  controllers: [AdminsController],
  providers: [AdminsService, PermissionsGuard],
  exports: [AdminsService], // Export for other modules
})
export class AdminsModule {}
```

## Adding a New Module

Let's create a complete "Reports" module as an example.

### Step 1: Generate Module Files

Create folder: `src/modules/reports/`

### Step 2: Create Entity

`src/modules/reports/entities/report.entity.ts`:

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  data: any;

  @Column({ nullable: true })
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;
}
```

### Step 3: Create DTOs

`src/modules/reports/dto/create-report.dto.ts`:

```typescript
import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  data?: any;
}
```

`src/modules/reports/dto/update-report.dto.ts`:

```typescript
import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateReportDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  data?: any;
}
```

### Step 4: Create Service

`src/modules/reports/reports.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  /**
   * Get all reports with pagination
   */
  async findAll(
    page: number = 1,
    perPage: number = 15,
    filters: any = {},
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    const query = this.reportsRepository
      .createQueryBuilder('report')
      .where('report.deleted_at IS NULL');

    // Apply search filter
    if (filters.search) {
      query.andWhere('(report.title LIKE :search OR report.description LIKE :search)', {
        search: `%${filters.search}%`,
      });
    }

    // Apply date range filters
    if (filters.from_date) {
      query.andWhere('report.created_at >= :from', { from: filters.from_date });
    }
    if (filters.to_date) {
      query.andWhere('report.created_at <= :to', { to: filters.to_date });
    }

    // Get total count
    const total = await query.getCount();

    // Apply pagination
    const data = await query
      .orderBy('report.created_at', order)
      .skip((page - 1) * perPage)
      .take(perPage)
      .getMany();

    return {
      data,
      page,
      limit: perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    };
  }

  /**
   * Get single report by ID
   */
  async findOne(id: number): Promise<Report> {
    const report = await this.reportsRepository.findOne({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }

  /**
   * Create new report
   */
  async create(createReportDto: CreateReportDto, adminId?: number): Promise<Report> {
    const report = this.reportsRepository.create({
      ...createReportDto,
      created_by: adminId,
    });

    return await this.reportsRepository.save(report);
  }

  /**
   * Update report
   */
  async update(id: number, updateReportDto: UpdateReportDto): Promise<Report> {
    const report = await this.findOne(id);

    Object.assign(report, updateReportDto);
    return await this.reportsRepository.save(report);
  }

  /**
   * Soft delete report
   */
  async delete(id: number): Promise<void> {
    const report = await this.findOne(id);
    await this.reportsRepository.softDelete(id);
  }

  /**
   * Restore soft-deleted report
   */
  async restore(id: number): Promise<void> {
    await this.reportsRepository.restore(id);
  }
}
```

### Step 5: Create Controller

`src/modules/reports/reports.controller.ts`:

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { I18nService } from '../../i18n/i18n.service';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('reports')
@UseGuards(AuthGuard('bearer'), PermissionsGuard)
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * GET /api/reports
   * Get all reports with pagination
   */
  @Get()
  @Permissions('reports.view')
  async findAll(
    @Query('page') page?: string,
    @Query('page_count') pageCount?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('search') search?: string,
    @Query('from_date') fromDate?: string,
    @Query('to_date') toDate?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const perPage = pageCount ? parseInt(pageCount, 10) : 15;
    const orderDir = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const filters = { search, from_date: fromDate, to_date: toDate };
    const result = await this.reportsService.findAll(pageNum, perPage, filters, orderDir);

    return {
      success: true,
      data: result,
      message: '',
    };
  }

  /**
   * GET /api/reports/:id
   * Get single report
   */
  @Get(':id')
  @Permissions('reports.view')
  async findOne(@Param('id') id: string) {
    const report = await this.reportsService.findOne(parseInt(id, 10));

    return {
      success: true,
      data: report,
      message: '',
    };
  }

  /**
   * POST /api/reports
   * Create new report
   */
  @Post()
  @Permissions('reports.create')
  async create(
    @Body() createReportDto: CreateReportDto,
    @Headers('accept-language') locale?: string,
    @Req() req?: any,
  ) {
    const adminId = req?.user?.id;
    const report = await this.reportsService.create(createReportDto, adminId);

    return {
      success: true,
      data: report,
      message: this.i18n.t('created', 'common', locale || 'en'),
    };
  }

  /**
   * PATCH /api/reports/:id
   * Update report
   */
  @Patch(':id')
  @Permissions('reports.update')
  async update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
    @Headers('accept-language') locale?: string,
  ) {
    const report = await this.reportsService.update(parseInt(id, 10), updateReportDto);

    return {
      success: true,
      data: report,
      message: this.i18n.t('updated', 'common', locale || 'en'),
    };
  }

  /**
   * DELETE /api/reports/:id
   * Soft delete report
   */
  @Delete(':id')
  @Permissions('reports.delete')
  async delete(@Param('id') id: string, @Headers('accept-language') locale?: string) {
    await this.reportsService.delete(parseInt(id, 10));

    return {
      success: true,
      data: null,
      message: this.i18n.t('deleted', 'common', locale || 'en'),
    };
  }

  /**
   * POST /api/reports/:id/restore
   * Restore deleted report
   */
  @Post(':id/restore')
  @Permissions('reports.restore')
  async restore(@Param('id') id: string, @Headers('accept-language') locale?: string) {
    await this.reportsService.restore(parseInt(id, 10));

    return {
      success: true,
      data: null,
      message: this.i18n.t('restored', 'common', locale || 'en'),
    };
  }
}
```

### Step 6: Create Module

`src/modules/reports/reports.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report } from './entities/report.entity';
import { I18nModule } from '../../i18n/i18n.module';
import { AdminModule } from '../admins/admin.module';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), I18nModule, AdminModule],
  controllers: [ReportsController],
  providers: [ReportsService, PermissionsGuard],
  exports: [ReportsService],
})
export class ReportsModule {}
```

### Step 7: Register in App Module

Edit `src/app.module.ts`:

```typescript
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    // ... other imports
    ReportsModule, // Add this line
  ],
})
export class AppModule {}
```

### Step 8: Add Permissions

Edit `src/database/seeders/permission.seeder.ts` and add:

```typescript
const permissions = [
  // ... existing permissions
  { name: 'reports.view' },
  { name: 'reports.create' },
  { name: 'reports.update' },
  { name: 'reports.delete' },
  { name: 'reports.restore' },
];
```

### Step 9: Run Database Migration

The backend uses `synchronize: true` in development, so tables are created automatically. For production, you should use migrations.

Restart the backend:

```bash
yarn dev
```

### Step 10: Test Your Endpoints

```bash
# Get all reports
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/reports

# Create report
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Report","description":"Test"}' \
  http://localhost:3001/api/reports
```

## Permissions System

### How Permissions Work

1. **Permissions** are strings like `"users.view"`, `"users.create"`, etc.
2. **Roles** have multiple permissions
3. **Admins** can have multiple roles
4. **Guards** check if admin has required permissions

### Using Permissions in Controllers

```typescript
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Controller('reports')
@UseGuards(AuthGuard('bearer'), PermissionsGuard)
export class ReportsController {
  // Requires "reports.view" permission
  @Get()
  @Permissions('reports.view')
  async findAll() {}

  // Requires "reports.create" permission
  @Post()
  @Permissions('reports.create')
  async create() {}

  // Requires EITHER "reports.update" OR "reports.delete"
  @Patch(':id')
  @Permissions('reports.update', 'reports.delete')
  async update() {}
}
```

### Permission Naming Convention

```
{module}.{action}

Examples:
- admins.view
- admins.create
- admins.edit
- admins.delete
- admins.assign_roles
- roles.view
- roles.create
- roles.edit
- roles.delete
- roles.assign_permissions
- settings.view
- settings.edit
- users.view
- users.create
- users.update
- users.delete
- users.restore
- users.verify
- projects.view
- projects.create
- projects.edit
- projects.delete
- projects.restore
- ai_chat.use
- ai_chat.view_models
```

**Note:** Tasks module does not use permissions - all authenticated admins can access task endpoints.

### Adding New Permissions

1. Add to seeder: `src/database/seeders/permission.seeder.ts`
2. Run seeder: `yarn seed`
3. Assign to roles via admin panel or database

## Database

### Supported Databases

- **MySQL** (Production)
- **SQLite** (Development) - uses better-sqlite3 driver

### Configuration

Edit `.env`:

```env
# Choose database type
DB_TYPE=sqlite  # or mysql

# For SQLite
SQLITE_DATABASE=./database.sqlite

# For MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=database_name
```

### Running Seeders

Seed all data:

```bash
yarn seed
```

Clear all data:

```bash
yarn reset
```

Drop all tables:

```bash
yarn drop
```

### Creating Seeders

Example: `src/database/seeders/reports.seeder.ts`

```typescript
import { DataSource } from 'typeorm';
import { Report } from '../../modules/reports/entities/report.entity';

export async function seedReports(dataSource: DataSource): Promise<void> {
  const reportRepository = dataSource.getRepository(Report);

  const reports = [
    {
      title: 'Monthly Sales Report',
      description: 'Sales data for the month',
      data: { total: 50000 },
    },
    // ... more reports
  ];

  for (const reportData of reports) {
    const existing = await reportRepository.findOne({
      where: { title: reportData.title },
    });

    if (!existing) {
      const report = reportRepository.create(reportData);
      await reportRepository.save(report);
      console.log(`✓ Created report: ${report.title}`);
    }
  }
}
```

Add to `src/database/seeder.ts`:

```typescript
import { seedReports } from './seeders/reports.seeder';

async function seed() {
  // ... existing seeders
  await seedReports(AppDataSource);
}
```

## Authentication

### JWT Authentication

All API endpoints (except `/auth/login` and `/auth/register`) require JWT authentication.

**Base URL:** `http://localhost:3001/api`

All endpoints are prefixed with `/api` and the server runs on port 3001 by default.

### Making Authenticated Requests

```typescript
// Headers
Authorization: Bearer YOUR_JWT_TOKEN
Accept-Language: en  // or ar
```

### Getting Current User

In controllers:

```typescript
@Post()
@UseGuards(AuthGuard('bearer'))
async create(@Req() req: any) {
    const currentAdmin = req.user;
    console.log(currentAdmin.id, currentAdmin.email);
}
```

## Internationalization

### Using Translations in Controllers

```typescript
import { I18nService } from '../../i18n/i18n.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly i18n: I18nService) {}

  @Post()
  async create(@Headers('accept-language') locale?: string) {
    // Get translation
    const message = this.i18n.t('created', 'reports', locale || 'en');

    return { success: true, message };
  }
}
```

### Adding Translations

Edit `src/i18n/translations/en/reports.json`:

```json
{
  "created": "Report created successfully",
  "updated": "Report updated successfully",
  "deleted": "Report deleted successfully"
}
```

Edit `src/i18n/translations/ar/reports.json`:

```json
{
  "created": "تم إنشاء التقرير بنجاح",
  "updated": "تم تحديث التقرير بنجاح",
  "deleted": "تم حذف التقرير بنجاح"
}
```

## API Response Format

All API responses follow this standard format:

### Success Response

```json
{
  "success": true,
  "data": {
    /* your data */
  },
  "message": "Operation successful"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "data": [
      /* array of items */
    ],
    "page": 1,
    "limit": 15,
    "total": 100,
    "totalPages": 7
  },
  "message": ""
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details"
}
```

## API Documentation

Detailed API documentation for each module:

- [Authentication API](./auth/README.md)
- [Users API](./users/README.md)
- [Admins API](./admins/README.md)
- [Roles API](./roles/README.md)
- [Projects API](./projects/README.md)
- [Tasks API](./tasks/README.md)
- [AI Chat API](./ai-chat/README.md)
- [Settings API](./settings/README.md)

---

**Need Help?** Check the inline comments in the source code or refer to existing modules!
