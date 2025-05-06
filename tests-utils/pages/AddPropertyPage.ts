import { type Locator, type Page, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Go up two levels to reach the root of tests-utils
const rootDir = path.resolve(__dirname, '../..');

export type RoomType = {
  name: string;
};

export class AddPropertyPage {
  readonly page: Page;
  readonly addPropertyButton: Locator;
  readonly hostel_name_input: Locator;
  readonly description_input: Locator;
  readonly address_input: Locator;
  readonly state_input: Locator;
  readonly city_input: Locator;
  readonly country_input: Locator;
  readonly image_input: Locator;
  readonly next_step_button: Locator;
  readonly price_per_year_input: Locator;
  readonly room_type_single: Locator;
  readonly room_type_double: Locator;
  readonly room_type_self_con: Locator;
  readonly room_and_pallor_self_con: Locator;
  readonly room_dormitory: Locator;
  readonly room_en_suit: Locator;
  readonly room_studio: Locator;
  readonly available_room_count_input: Locator;
  readonly amenity_wifi: Locator;
  readonly amenity_security: Locator;
  readonly amenity_water_supply: Locator;
  readonly amenity_electricity: Locator;
  readonly amenity_bathroom: Locator;
  readonly amenity_kitchen: Locator;
  readonly amenity_laundry: Locator;
  readonly amenity_study_room: Locator;
  readonly amenity_tv_room: Locator;
  readonly amenity_cafeteria: Locator;
  readonly amenity_parking: Locator;
  readonly amenity_generator: Locator;
  readonly amenity_air_conditioning: Locator;
  readonly contact_email_input: Locator;
  readonly contact_phone_input: Locator;
  readonly hostel_rules_input: Locator;
  readonly latitude_input: Locator;
  readonly longitude_input: Locator;
  readonly review_button: Locator;
  readonly confirm_button: Locator;
  readonly cancel_button: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addPropertyButton = page.getByTestId("add-first-property-button");
    this.hostel_name_input = page.getByTestId("hostel-name-input");
    this.description_input = page.getByTestId("hostel-description-input");
    this.address_input = page.getByTestId("hostel-address-input");
    this.state_input = page.getByTestId("hostel-state-input");
    this.city_input = page.getByTestId("hostel-city-input");
    this.country_input = page.getByTestId("hostel-country-input");
    this.image_input = page.getByText("Click to upload images or");
    this.next_step_button = page.getByTestId("next-step-button");
    this.price_per_year_input = page.getByTestId("hostel-price-input");
    this.room_type_single = page.getByTestId("roomType-Single");
    this.room_type_double = page.getByTestId("roomType-Double");
    this.room_type_self_con = page.getByTestId("roomType-Self Contained");
    this.room_and_pallor_self_con = page.getByTestId(
      "roomType-Room and Parllor Self Contained"
    );
    this.room_dormitory = page.getByTestId("roomType-Dormitory");
    this.room_en_suit = page.getByTestId("roomType-En-suite");
    this.room_studio = page.getByTestId("roomType-Studio");
    this.available_room_count_input = page.getByTestId(
      "hostel-availability-input"
    );
    this.amenity_wifi = page.getByTestId("amenity-Wi-Fi");
    this.amenity_security = page.getByTestId("amenity-Security");
    this.amenity_water_supply = page.getByTestId("amenity-Water Supply");
    this.amenity_electricity = page.getByTestId("amenity-Electricity");
    this.amenity_bathroom = page.getByTestId("amenity-Bathroom");
    this.amenity_kitchen = page.getByTestId("amenity-Kitchen");
    this.amenity_laundry = page.getByTestId("amenity-Laundry");
    this.amenity_study_room = page.getByTestId("amenity-Study Room");
    this.amenity_tv_room = page.getByTestId("amenity-TV Room");
    this.amenity_cafeteria = page.getByTestId("amenity-Cafeteria");
    this.amenity_parking = page.getByTestId("amenity-Parking");
    this.amenity_generator = page.getByTestId("amenity-Generator");
    this.amenity_air_conditioning = page.getByTestId(
      "amenity-Air Conditioning"
    );
    this.contact_email_input = page.getByTestId("hostel-email-input");
    this.contact_phone_input = page.getByTestId("hostel-phone-input");
    this.hostel_rules_input = page.getByTestId("hostel-rules-input");
    this.latitude_input = page.getByTestId("hostel-latitude-input");
    this.longitude_input = page.getByTestId("hostel-longitude-input");
    this.review_button = page.getByTestId("review-button");
    this.confirm_button = page.getByTestId("confirm-button");
    this.cancel_button = page.getByTestId("cancel-button");
  }

  async fillPropertyDetailsStep1(
    hostelName: string,
    description: string,
    address: string,
    state: string,
    city: string,
    country: string,
    imagePath: Array<string>
  ) {
    await this.hostel_name_input.clear();
    await this.hostel_name_input.fill(hostelName);

    await this.description_input.clear();
    await this.description_input.fill(description);

    await this.address_input.clear();
    await this.address_input.fill(address);

    await this.state_input.clear();
    await this.state_input.fill(state);

    await this.city_input.clear();
    await this.city_input.fill(city);

    await this.country_input.clear();
    await this.country_input.fill(country);    
    
    for (const image of imagePath) {
      const roomImagePath = path.resolve(rootDir, image);
      await this.image_input.setInputFiles(roomImagePath);
    }
  }

  async fillPropertyDetailsStep2(
    price: number,
    roomCount: number,
    roomTypes: Array<string>
  ) {
    await this.price_per_year_input.clear();
    await this.price_per_year_input.fill(price.toString());

    await this.available_room_count_input.clear();
    await this.available_room_count_input.fill(roomCount.toString());

    for (const roomType of roomTypes) {
      await this.selectRoomType(roomType);
    }
  }

  async fillPropertyDetailsStep3(
    amenities?: Array<string>,
    hostel_email?: string,
    hostel_phone?: string,
    rules?: string,
    latitude?: number,
    longitude?: number
  ) {
    if (amenities) {
      for (const amenity of amenities) {
        await this.selectAmenity(amenity);
      }
    }

    await this.contact_email_input.clear();
    await this.contact_email_input.fill(hostel_email ? hostel_email : "");

    await this.contact_phone_input.clear();
    await this.contact_phone_input.fill(hostel_phone ? hostel_phone : "");

    await this.hostel_rules_input.clear();
    await this.hostel_rules_input.fill(rules ? rules : "");

    await this.latitude_input.clear();
    await this.latitude_input.fill(latitude ? latitude.toString() : "");

    await this.longitude_input.clear();
    await this.longitude_input.fill(longitude ? longitude.toString() : "");
  }

  async clickNextStepButton() {
    await this.next_step_button.click();
  }

  async clickReviewButton() {
    await this.review_button.click();
  }

  async clickConfirmButton() {
    await this.confirm_button.click();
  }

  async clickCancelButton() {
    await this.cancel_button.click();
  }

  private async selectRoomType(roomType: string) {
    switch (roomType) {
      case "Single":
        await this.room_type_single.click();
        break;
      case "Double":
        await this.room_type_double.click();
        break;
      case "Self Contained":
        await this.room_type_self_con.click();
        break;
      case "Room and Pallor Self Contained":
        await this.room_and_pallor_self_con.click();
        break;
      case "Dormitory":
        await this.room_dormitory.click();
        break;
      case "En-suite":
        await this.room_en_suit.click();
        break;
      case "Studio":
        await this.room_studio.click();
        break;
      default:
        throw new Error(`Unknown room type: ${roomType}`);
    }
  }

  private async selectAmenity(amenity: string) {
    switch (amenity) {
      case "Wi-Fi":
        await this.amenity_wifi.click();
        break;
      case "Security":
        await this.amenity_security.click();
        break;
      case "Water Supply":
        await this.amenity_water_supply.click();
        break;
      case "Electricity":
        await this.amenity_electricity.click();
        break;
      case "Bathroom":
        await this.amenity_bathroom.click();
        break;
      case "Kitchen":
        await this.amenity_kitchen.click();
        break;
      case "Laundry":
        await this.amenity_laundry.click();
        break;
      case "Study Room":
        await this.amenity_study_room.click();
        break;
      case "TV Room":
        await this.amenity_tv_room.click();
        break;
      case "Cafeteria":
        await this.amenity_cafeteria.click();
        break;
      case "Parking":
        await this.amenity_parking.click();
        break;
      case "Generator":
        await this.amenity_generator.click();
        break;
      case "Air Conditioning":
        await this.amenity_air_conditioning.click();
        break;
      default:
        throw new Error(`Unknown amenity: ${amenity}`);
    }
  }
}
