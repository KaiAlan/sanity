"use client";

import React, { useState } from "react";
import {
  useForm,
  useFieldArray,
  FormProvider,
  useFormContext,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { userOnboardingSchema } from "../../model/Schema/onboardingSchema";
import { categories } from "../../model/Schema/onboardingSchema"; // Assume categories array is defined
import { Label } from "../../@/components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../@/components/ui/avatar";
import { Input } from "../../@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../@/components/ui/select";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../../@/components/ui/card";
import { Textarea } from "../../@/components/ui/textarea";
import { Button } from "../../@/components/ui/button";
import { Checkbox } from "../../@/components/ui/checkbox";
import { games } from "../games/data";
import { cn } from "../../@/lib/utils";

const steps = [
  {
    id: "Step-1",
    name: "Profile",
    fields: [
      "avatar",
      "experience",
      "username",
      "fullName",
      "gender",
      "city",
      "country",
      "bio",
    ],
  },
  {
    id: "Step-2",
    name: "Favourite Games",
    fields: ["favouriteGame"],
  },
  {
    id: "Step-3",
    name: "Favourite Category",
    fields: ["favouriteCategory"],
  },
  {
    id: "Step-4",
    name: "Socials",
    fields: ["socials"],
  },
  {
    id: "Step-5",
    name: "",
  },
];

const OnboardingForm = () => {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;

  const methods = useForm({
    resolver: zodResolver(userOnboardingSchema),
    defaultValues: {
      avatar: "",
      experience: "beginner",
      username: "",
      fullName: "",
      gender: "prefer not to say",
      city: "",
      country: "",
      bio: "",
      favouriteGame: [],
      favouriteCategory: [],
      socials: { twitter: "", facebook: "", youtube: "" },
    },
  });

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "favouriteGame",
  });

  const onSubmit = (data) => {
    console.log("Form Submitted", data);
    reset();
  };

  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields, { shouldFocus: true });

    console.log(output, errors);
    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(onSubmit)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-5xl w-full mx-auto min-h-[700px]  flex flex-col justify-center items-center p-6 md:p-12 rounded-xl shadow md:border md:border-gray-800/70">
        <nav aria-label="Progress">
          <ol
            role="list"
            className="space-y-4 md:flex md:space-x-8 md:space-y-0"
          >
            {steps.map((step, index) => (
              <li key={step.name} className="md:flex-1">
                {currentStep > index ? (
                  <div className="group flex w-4 flex-col border-l-4 border-green-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4" />
                ) : currentStep === index ? (
                  <div
                    className="flex w-4 flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                    aria-current="step"
                  />
                ) : (
                  <div className="group flex w-4 flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4" />
                )}
              </li>
            ))}
          </ol>
        </nav>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <h2 className="text-xl font-bold">{steps[currentStep].name}</h2>
          <div className="mt-4">
            {currentStep === 0 && <StepOne delta={delta} />}
            {currentStep === 1 && <StepTwo delta={delta} />}
            {currentStep === 2 && <StepThree delta={delta} />}
            {currentStep === 3 && <StepFour delta={delta} />}
            {currentStep === 4 && <Finish delta={delta} />}
            {/* {currentStep === 4 && <Confetti />} */}
          </div>
          <div className="flex justify-between mt-4">
            <Button
              type="button"
              disabled={currentStep === 0}
              onClick={handleBack}
              className={cn(
                "",
                currentStep === steps.length - 1 ? "hidden" : "",
              )}
            >
              Back
            </Button>
            <Button
              type="button"
              disabled={currentStep === steps.length - 1}
              onClick={handleNext}
              className={cn(
                "",
                currentStep === steps.length - 1 ? "hidden" : "",
              )}
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

const StepOne = ({ delta }) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setAvatarPreview(result);
        setValue("avatar", result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full flex flex-col gap-4"
    >
      {/* Avatar */}
      <div className="w-full flex flex-col sm:flex-row items-center gap-4 space-x-4">
        <div className="flex flex-col justify-start items-center gap-2">
          <Avatar className="h-40 w-40 rounded-full border border-gray-800/60">
            {avatarPreview ? (
              <AvatarImage src={avatarPreview} />
            ) : (
              <AvatarFallback>Avatar</AvatarFallback>
            )}
          </Avatar>
          {/* <Label className='text-gray-400 font-semibold'>Avatar</Label> */}
        </div>
        <Input
          type="file"
          accept="image/*"
          className="w-full flex justify-center items-center border-gray-700/50 cursor-pointer"
          onChange={handleAvatarChange}
        />
        {errors.avatar && (
          <p className="text-red-500 text-sm">{errors.avatar.message}</p>
        )}
      </div>

      <div className="w-full flex flex-col sm:flex-row justify-center items-start gap-8">
        {/* Username */}
        <div className="w-full flex flex-col gap-2">
          <Label className="text-gray-300 text-lg font-semibold">
            Username
          </Label>
          <Input
            type="text"
            {...register("username")}
            // placeholder="Enter your username"
            className="text-gray-600 border-gray-700/50 text-lg min-h-12"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        {/* Full Name */}
        <div className="w-full flex flex-col gap-2">
          <Label className="text-gray-300 text-lg font-semibold">
            Full Name
          </Label>
          <Input
            type="text"
            {...register("fullName")}
            // placeholder="Enter your full name"
            className="text-gray-600 border-gray-700/50 text-lg min-h-12"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col sm:flex-row justify-center items-start gap-8">
        {/* Gender */}
        <div className="w-full flex flex-col gap-2">
          <Label className="text-gray-300 text-lg font-semibold">Gender</Label>
          <Select
            onValueChange={(value) => setValue("gender", value)}
            className="w-full"
          >
            <SelectTrigger className="min-h-12 text-gray-600 border-gray-700/50 text-lg">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer not to say">
                Prefer not to say
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender.message}</p>
          )}
        </div>

        {/* Experience */}
        <div className="w-full flex flex-col gap-2">
          <Label className="text-gray-300 text-lg font-semibold">
            Experience
          </Label>
          <Select
            onValueChange={(value) => setValue("experience", value)}
            className="w-full"
          >
            <SelectTrigger className="min-h-12 text-gray-600 border-gray-700/50 text-lg">
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800">
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
              <SelectItem value="ninja">Ninja</SelectItem>
            </SelectContent>
          </Select>
          {errors.experience && (
            <p className="text-red-500 text-sm">{errors.experience.message}</p>
          )}
        </div>
      </div>

      <div className="w-full flex justify-center items-start gap-8">
        {/* City */}
        <div className="w-full flex flex-col gap-2">
          <Label className="text-gray-300 text-lg font-semibold">City</Label>
          <Input
            type="text"
            {...register("city")}
            // placeholder="Enter your city"
            className="text-gray-600 border-gray-700/50 text-lg min-h-12"
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>

        {/* Country */}
        <div className="w-full flex flex-col gap-2">
          <Label className="text-gray-300 text-lg font-semibold">Country</Label>
          <Input
            type="text"
            {...register("country")}
            // placeholder="Enter your country"
            className="text-gray-600 border-gray-700/50 min-h-12 text-lg"
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
        </div>
      </div>

      {/* Bio */}
      <div>
        <Label className="text-gray-300 text-lg font-semibold">Bio</Label>
        <Textarea
          {...register("bio")}
          placeholder="Tell us about yourself"
          rows={4}
          className="border-gray-600 text-gray-400 border-gray-700/50"
        />
        {errors.bio && (
          <p className="text-red-500 text-sm">{errors.bio.message}</p>
        )}
      </div>
    </motion.div>
  );
};

const StepThree = ({ delta }) => {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const favouriteCategory = watch("favouriteCategory") || [];

  const handleCheckboxChange = (category) => {
    let updatedCategories = [...favouriteCategory];

    if (!favouriteCategory.includes(category)) {
      updatedCategories.push(category);
    } else {
      updatedCategories = updatedCategories.filter((item) => item !== category);
    }

    setValue("favouriteCategory", updatedCategories);
  };

  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full"
    >
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card
            key={category}
            className="p-1 border border-gray-900 rounded-sm sm:rounded-md"
          >
            <CardHeader className="p-2 md:p-6">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-lg text-gray-400 font-semibold">
                  {category}
                </Label>
                <Checkbox
                  checked={favouriteCategory.includes(category)}
                  onCheckedChange={() => handleCheckboxChange(category)}
                />
              </div>
            </CardHeader>
          </Card>
        ))}
        {errors.favouriteCategory && (
          <p className="text-red-500 text-sm">
            {errors.favouriteCategory.message}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const StepTwo = ({ delta }) => {
  const { setValue, control } = useFormContext();
  const [selectedGames, setSelectedGames] = useState([]);

  const handleGameSelection = (gameId, gameName) => {
    const isSelected = selectedGames.some((game) => game.id === gameId);
    const newSelectedGames = isSelected
      ? selectedGames.filter((game) => game.id !== gameId)
      : [...selectedGames, { id: gameId, name: gameName }]; // Add game name here

    setSelectedGames(newSelectedGames);

    // Dynamically set the value of favouriteGame using setValue
    const updatedFavouriteGames = newSelectedGames.map((game) => ({
      game: game.name, // Store the game name
      username: "", // initialize with empty username for each selected game
    }));

    setValue("favouriteGame", updatedFavouriteGames);
  };
  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {games.map((game) => (
          <Card
            key={game.id}
            className="py-1 px-1.5 sm:px-4 sm:py-4 md:p-4 lg:px-8 xl:p-4 border border-gray-900 rounded-none md:rounded-md"
          >
            <CardHeader className="p-0 py-1">
              <div className="flex items-center justify-between">
                <Label>{game.name}</Label>
                <Checkbox
                  checked={selectedGames.some(
                    (selected) => selected.id === game.id,
                  )}
                  onCheckedChange={() =>
                    handleGameSelection(game.id, game.name)
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="px-0 py-4">
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-40 sm:h-60 md:h-64 lg:h-60 object-cover rounded-md"
              />
            </CardContent>
            {selectedGames.some((selected) => selected.id === game.id) && (
              <CardFooter className="p-0 pb-2">
                <Controller
                  name={`favouriteGame.${selectedGames.findIndex((selected) => selected.id === game.id)}.username`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder={`Enter your ${game.name} username`}
                      className="border-gray-700 text-xs text-gray-300"
                      {...field}
                    />
                  )}
                />
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

const StepFour = ({ delta }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col gap-4"
    >
      {/* Twitter */}
      <div>
        <Label
          htmlFor="twitter"
          className="block mb-1 text-lg text-gray-400 font-semibold"
        >
          Twitter
        </Label>
        <Input
          type="url"
          id="twitter"
          placeholder="Twitter handle"
          className="min-h-12 border-gray-900 text-lg text-gray-500"
          {...register("socials.twitter")}
        />
        {errors.socials && (
          <p className="mt-1 text-sm text-red-600">
            {errors.socials.twitter.message}
          </p>
        )}
      </div>

      {/* Facebook */}
      <div>
        <Label
          htmlFor="facebook"
          className="block mb-1 text-lg text-gray-400 font-semibold"
        >
          Facebook
        </Label>
        <Input
          type="url"
          id="facebook"
          placeholder="Facebook profile"
          className="min-h-12 border-gray-900 text-lg text-gray-500"
          {...register("socials.facebook")}
        />
        {errors.socials && (
          <p className="mt-1 text-sm text-red-600">
            {errors.socials.facebook.message}
          </p>
        )}
      </div>

      {/* YouTube */}
      <div>
        <Label
          htmlFor="youtube"
          className="block mb-1 text-lg text-gray-400 font-semibold"
        >
          YouTube
        </Label>
        <Input
          type="url"
          optional
          id="youtube"
          placeholder="Youtube channel"
          className="min-h-12 border-gray-900 text-lg text-gray-500"
          {...register("socials.youtube")}
        />
        {errors.socials && (
          <p className="mt-1 text-sm text-red-600">
            {errors.socials.youtube.message}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const Finish = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <h2 className="text-4xl font-semibold text-green-500">
        🎉 Congratulations! 🎉
      </h2>
      <p className="text-xl mt-4 text-gray-600">
        You have successfully completed the onboarding process. Hooray! 🎊
      </p>
      <div className="mt-6">
        <Button className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600">
          Checkout Tournament
        </Button>
      </div>
    </div>
  );
};

export default OnboardingForm;
