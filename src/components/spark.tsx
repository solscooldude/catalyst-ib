"use client";

import { useEffect, useId, useRef, useState, type Ref } from "react";
import "@/app/sprite-motion.css";
import {
  getSparkAura,
  type SparkAuraId,
  type SparkGearId,
  type SparkTintId,
  type SparkTrailId,
} from "@/lib/appearance";
import { SparkParticleRing, SubjectFlourish } from "@/components/spark-flourishes";
import {
  SPARK_FLAVOR_INK,
  sparkFlavorFromContext,
  sparkHintFromTask,
  type SparkFlavor,
} from "@/lib/spark-flavor";
import { TASK_SUBJECT, type SubjectId, type TaskId } from "@/lib/constants";
import { type SnackId, type SparkAct } from "@/lib/spark-play";
import { displaySpriteName } from "@/lib/sprite-name";
import { signatureGlowForStage, sparkEvolutionFromState, type CareStage } from "@/lib/stats";
import {
  normalizeSpriteSpecies,
  spriteBodyPalette,
} from "@/lib/sprite-species";
import { SpeciesEgg, SpriteCritter } from "@/components/sprite-critter";
import { useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";
