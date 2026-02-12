import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';

@Injectable()
export class CountriesService {
    constructor(
        @InjectRepository(Country)
        private countryRepository: Repository<Country>,
    ) { }

    /**
     * Find all countries
     */
    async findAll(): Promise<Country[]> {
        return this.countryRepository.find({
            order: { code: 'ASC' },
        });
    }

    /**
     * Find one country by ID
     */
    async findOne(id: number): Promise<Country> {
        return this.countryRepository.findOne({ where: { id } });
    }
}
