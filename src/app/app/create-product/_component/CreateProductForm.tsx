"use client";

import { Button } from "@/components/ui/button";
import GoogleMapComponent from "@/src/components/common/GoogleMapPicker";
import { InputField } from "@/src/components/common/InputField";
import { SelectField } from "@/src/components/common/SelectField";
import ToggleSelectField from "@/src/components/common/ToggleSelectField";
import { CreateProductPayload, createProductSchema } from "@/src/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Camera, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import DaySelector from "./DaySelector";
import { DaysOfWeek } from "@/src/types/index.type";
const TimeOptions = [
  { label: "06:00 AM", value: "06:00" },
  { label: "07:00 AM", value: "07:00" },
  { label: "08:00 AM", value: "08:00" },
  { label: "09:00 AM", value: "09:00" },
  { label: "10:00 AM", value: "10:00" },
  { label: "11:00 AM", value: "11:00" },
  { label: "12:00 PM", value: "12:00" },
  { label: "01:00 PM", value: "13:00" },
  { label: "02:00 PM", value: "14:00" },
  { label: "03:00 PM", value: "15:00" },
  { label: "04:00 PM", value: "16:00" },
  { label: "05:00 PM", value: "17:00" },
  { label: "06:00 PM", value: "18:00" },
  { label: "07:00 PM", value: "19:00" },
  { label: "08:00 PM", value: "20:00" },
];

const CreateProductForm = () => {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  } | null>(null);

  const [selectedDays, setSelectedDays] = useState<DaysOfWeek>();

  const handleDaysChange = (days: DaysOfWeek) => {
    setSelectedDays(days);
    console.log(
      "Selected days:",
      days.filter((d) => d.enabled).map((d) => d.day),
    );
  };

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<CreateProductPayload>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      productName: "",
      description: "",
      quantity: 0,
      category: "",
      subCategory: "",
      availableDays: [],
      pickupTime: "",
      dropOffTime: "",
      hourlyPrice: 0,
      dailyPrice: 0,
      images: [],
      coverImage: null,
      location: undefined,
    },
  });
  const onLocationSelect = (loc: any) => {
    const lat = loc.location.coordinates[1];
    const lng = loc.location.coordinates[0];

    setLocation({
      lat,
      lng,
      address: loc.address,
      city: loc.city,
      state: loc.state,
      country: loc.country,
    });
    // setValue("location", { lat, lng });
    // clearErrors("location");
  };
  const onsubmit = () => {};

  return (
    <div className=" mx-auto px-4 py-6 text-white">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-xl font-semibold text-foreground">Add Product</h1>
      </div>
      <form action="" onSubmit={handleSubmit(onsubmit)}>
        <div className="space-y-6">
          <div
            className={`border border-dashed rounded-2xl h-56 flex flex-col items-center justify-center cursor-pointer transition
    ${
      errors.images
        ? "border-red-500 text-red-500"
        : "border-muted-foreground text-muted-foreground hover:border-[#F85E00]"
    }
  `}
          >
            <Camera size={36} />
            <p className="mt-3 font-medium">Upload Product Images</p>
            <p className="text-xs mt-1 opacity-70">PNG, JPG supported</p>
          </div>
          {errors.images && (
            <p className="mt-2 text-sm text-red-500">{errors.images.message}</p>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertCircle size={14} />
            <span>Select at least 4 images</span>
          </div>

          <div
            className={`border border-dashed rounded-2xl h-56 flex flex-col items-center justify-center cursor-pointer transition
    ${
      errors.coverImage
        ? "border-red-500 text-red-500"
        : "border-muted-foreground text-muted-foreground hover:border-[#F85E00]"
    }
  `}
          >
            {" "}
            <Camera size={30} />
            <p className="mt-2 font-medium">Upload Cover Image</p>
          </div>
          {errors.coverImage && (
            <p className="mt-2 text-sm text-red-500">
              {String(errors.coverImage.message)}
            </p>
          )}
        </div>

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Product Name"
              error={errors.productName?.message}
              {...register("productName")}
              placeholder="Enter Product Name"
            />
            <InputField
              error={errors.description?.message}
              {...register("description")}
              label="Description"
              placeholder="Enter Description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              type="number"
              label="Quantity"
              placeholder="Enter Quantity"
              error={errors.quantity?.message}
              {...register("quantity")}
            />
            <SelectField
              label="Category"
              placeholder="Select Category"
              options={[
                { label: "Electronics", value: "electronics" },
                { label: "Furniture", value: "furniture" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Sub Category"
              placeholder="Select"
              options={[
                { label: "Electronics", value: "electronics" },
                { label: "Furniture", value: "furniture" },
              ]}
            />

            <div className="">
              <DaySelector
                selectedDays={selectedDays}
                onChange={handleDaysChange}
                label="Working Days"
                showSelectedCount={true}
              />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 mt-6 text-sm text-muted-foreground">
          <AlertCircle size={16} />
          <p>
            The product location you select must match your device&apos;s
            timezone for accurate booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <SelectField
            label="Pick Up Time"
            placeholder="Select"
            options={TimeOptions}
            error={errors.pickupTime?.message}
            {...register("pickupTime")}
          />
          <SelectField
            label="Drop Off Time"
            placeholder="Select"
            options={TimeOptions}
            error={errors.dropOffTime?.message}
            {...register("dropOffTime")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <InputField
            type="number"
            label="Hourly Price"
            placeholder="Enter Price"
            error={errors.hourlyPrice?.message}
            {...register("hourlyPrice")}
          />
          <InputField
            type="number"
            label="Daily Price"
            placeholder="Enter Price"
            error={errors.dailyPrice?.message}
            {...register("dailyPrice")}
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button className="bg-[#F85E00] cursor-pointer h-12 rounded-xl px-6 text-sm font-medium">
            Same as Profile
          </button>

          <button className="bg-foreground h-12  cursor-pointer rounded-xl px-6 flex items-center gap-2 text-sm font-medium">
            <Plus size={16} />
            Add New
          </button>
        </div>

        <div className="mt-4">
          <GoogleMapComponent onLocationSelect={onLocationSelect} />
        </div>
        <div className="flex items-start gap-2 mt-6 text-sm text-muted-foreground">
          <AlertCircle size={16} />
          <p>
            Every booking comes with peace of mind! You'll get an email to
            review and sign the contract before pickup-every time. No signature,
            no handoff.
          </p>
        </div>
        <Button
          type="submit"
          className="w-full mt-8 h-12.25 bg-[#F85E00] text-white font-semibold tracking-wide"
        >
          Add Rental Product
        </Button>
      </form>
    </div>
  );
};

export default CreateProductForm;
