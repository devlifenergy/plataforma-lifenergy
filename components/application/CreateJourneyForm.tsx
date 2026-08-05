"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createJourney } from "@/services/journeys/actions";

type ApplicatorOption = {
  id: string;
  name: string;
};

type CreateJourneyFormProps = {
  applicators: ApplicatorOption[];
};

export function CreateJourneyForm({ applicators }: CreateJourneyFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        await createJourney(formData);
        formRef.current?.reset();
        setSuccess(true);
        router.refresh();
      } catch (caughtError) {
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : "Não foi possível criar o convite.";
        setError(message);
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
      <label className="block">
        <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
          Aplicador *
        </span>

        <select
          name="applicator_id"
          required
          disabled={isPending}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base leading-6 text-slate-900 outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
        >
          <option value="">Selecione</option>
          {applicators.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <Input
        name="participant_name"
        label="Nome do avaliado *"
        required
        disabled={isPending}
      />
      <Input
        name="participant_email"
        label="E-mail"
        type="email"
        disabled={isPending}
      />

      <div className="flex items-end">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Criando..." : "Criar Convite"}
        </Button>
      </div>

      <label className="block md:col-span-4">
        <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
          Atividade *
        </span>
        <textarea
          name="activity"
          required
          rows={3}
          disabled={isPending}
          className="min-h-28 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-base leading-7 text-slate-900 outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
        />
      </label>

      <div className="md:col-span-4">
        {success ? (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-[15px] font-medium leading-6 text-emerald-700">
            Convite criado com sucesso. Os campos foram limpos para evitar links repetidos.
          </p>
        ) : null}

        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-[15px] font-medium leading-6 text-red-700">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
