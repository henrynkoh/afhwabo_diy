// NWMLS Matrix Property Data Fetcher
// Uses Playwright for secure browser automation

import { chromium, Browser, Page } from 'playwright';
import type { PropertyData, NWMLSCredentials } from '@/types';

export class NWMLSFetcher {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private credentials: NWMLSCredentials | null = null;

  async initialize(credentials: NWMLSCredentials) {
    this.credentials = credentials;
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
    
    // Navigate to Matrix login
    await this.page.goto('https://matrix.nwmls.com/');
    
    // Wait for login form and fill credentials
    await this.page.waitForSelector('input[name="username"], input[type="text"]', { timeout: 10000 });
    await this.page.fill('input[name="username"], input[type="text"]', credentials.username);
    await this.page.fill('input[name="password"], input[type="password"]', credentials.password);
    
    // Submit login
    await this.page.click('button[type="submit"], input[type="submit"]');
    
    // Wait for navigation after login
    await this.page.waitForURL('**/matrix.nwmls.com/**', { timeout: 15000 });
    
    return true;
  }

  async fetchByMLS(mlsNumber: string): Promise<PropertyData> {
    if (!this.page) {
      throw new Error('Fetcher not initialized. Call initialize() first.');
    }

    // Navigate to search or direct property page
    await this.page.goto(`https://matrix.nwmls.com/Matrix/Public/Portal.aspx?ID=0-${mlsNumber}`);
    
    // Wait for property data to load
    await this.page.waitForSelector('.property-details, .listing-details', { timeout: 10000 });

    // Extract property data using selectors (these may need adjustment based on actual Matrix UI)
    const propertyData: PropertyData = {
      mlsNumber,
      address: await this.extractText('.address, [data-field="address"]') || '',
      city: await this.extractText('.city, [data-field="city"]') || '',
      state: 'WA',
      zipCode: await this.extractText('.zip, [data-field="zip"]') || '',
      squareFeet: await this.extractNumber('.sqft, [data-field="squareFeet"]'),
      bedrooms: await this.extractNumber('.bedrooms, [data-field="bedrooms"]'),
      bathrooms: await this.extractNumber('.bathrooms, [data-field="bathrooms"]'),
      yearBuilt: await this.extractNumber('.yearBuilt, [data-field="yearBuilt"]'),
      levels: await this.extractNumber('.levels, [data-field="levels"]'),
      photoUrls: await this.extractPhotoUrls(),
      floorPlanUrl: await this.extractFloorPlanUrl(),
      hasStairs: await this.checkHasStairs(),
    };

    return propertyData;
  }

  async fetchByAddress(address: string, city: string = 'Seattle', state: string = 'WA'): Promise<PropertyData> {
    if (!this.page) {
      throw new Error('Fetcher not initialized. Call initialize() first.');
    }

    // Navigate to search page
    await this.page.goto('https://matrix.nwmls.com/Matrix/Public/Portal.aspx');
    
    // Perform address search
    await this.page.fill('input[name="address"], input[placeholder*="address" i]', address);
    await this.page.fill('input[name="city"], input[placeholder*="city" i]', city);
    await this.page.click('button[type="submit"], button:has-text("Search")');
    
    // Wait for results
    await this.page.waitForSelector('.search-results, .listing-item', { timeout: 10000 });
    
    // Click first result
    await this.page.click('.listing-item:first-child, .search-result:first-child');
    
    // Extract property data (similar to fetchByMLS)
    const mlsNumber = await this.extractText('.mls-number, [data-field="mlsNumber"]') || '';
    
    return this.fetchByMLS(mlsNumber);
  }

  private async extractText(selector: string): Promise<string | null> {
    if (!this.page) return null;
    try {
      const element = await this.page.$(selector);
      return element ? await element.textContent() : null;
    } catch {
      return null;
    }
  }

  private async extractNumber(selector: string): Promise<number | undefined> {
    const text = await this.extractText(selector);
    if (!text) return undefined;
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? undefined : num;
  }

  private async extractPhotoUrls(): Promise<string[]> {
    if (!this.page) return [];
    try {
      const images = await this.page.$$eval('img.property-photo, .photo-gallery img', (imgs) =>
        imgs.map((img) => (img as HTMLImageElement).src).filter((src) => src && !src.includes('placeholder'))
      );
      return images;
    } catch {
      return [];
    }
  }

  private async extractFloorPlanUrl(): Promise<string | undefined> {
    if (!this.page) return undefined;
    try {
      const link = await this.page.$('a[href*="floorplan"], a[href*="floor-plan"]');
      return link ? await link.getAttribute('href') || undefined : undefined;
    } catch {
      return undefined;
    }
  }

  private async checkHasStairs(): Promise<boolean> {
    if (!this.page) return false;
    const text = await this.page.textContent('body') || '';
    return /stair|level|story|floor/i.test(text);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

// Mock data generator for development/testing
export function generateMockPropertyData(mlsNumber?: string): PropertyData {
  return {
    mlsNumber: mlsNumber || '9876543',
    address: '1234 Example Street',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98105',
    squareFeet: 2500,
    bedrooms: 4,
    bathrooms: 2.5,
    yearBuilt: 1985,
    levels: 2,
    roomDimensions: [
      { roomType: 'Master Bedroom', length: 14, width: 12, squareFeet: 168 },
      { roomType: 'Bedroom 2', length: 12, width: 10, squareFeet: 120 },
      { roomType: 'Bedroom 3', length: 11, width: 9, squareFeet: 99 },
      { roomType: 'Bedroom 4', length: 10, width: 8, squareFeet: 80 },
    ],
    hasStairs: true,
    hasRamp: false,
    photoUrls: [],
    floorPlanUrl: undefined,
  };
}

