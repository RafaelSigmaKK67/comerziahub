"use client";

import { useActionState } from "react";
import { createProduct } from "@/actions/store";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UNIT_OPTIONS } from "@/lib/constants";

export function ProductForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(createProduct, {});
  return (
    <form action={action} className="max-w-2xl space-y-4">
      {state.error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{state.error}</p>
      )}
      <div>
        <Label htmlFor="name">Nome do produto</Label>
        <Input id="name" name="name" required />
        <FieldError message={state.fieldErrors?.name?.[0]} />
      </div>
      <div>
        <Label htmlFor="imageUrl">URL da imagem (opcional)</Label>
        <Input id="imageUrl" name="imageUrl" placeholder="https://..." />
      </div>
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" name="description" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="basePrice">Preço de venda (R$)</Label>
          <Input id="basePrice" name="basePrice" type="number" step="0.01" min="0" required />
          <FieldError message={state.fieldErrors?.basePrice?.[0]} />
        </div>
        <div>
          <Label htmlFor="promoPrice">Preço promocional (R$)</Label>
          <Input id="promoPrice" name="promoPrice" type="number" step="0.01" min="0" />
        </div>
        <div>
          <Label htmlFor="costPrice">Preço de custo (R$)</Label>
          <Input id="costPrice" name="costPrice" type="number" step="0.01" min="0" placeholder="p/ cálculo de lucro" />
        </div>
        <div>
          <Label htmlFor="unit">Unidade de medida</Label>
          <Select id="unit" name="unit" defaultValue="UN">
            {UNIT_OPTIONS.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <Label htmlFor="stock">Estoque</Label>
          <Input id="stock" name="stock" type="number" step="0.001" min="0" defaultValue={0} />
        </div>
        <div>
          <Label htmlFor="minQuantity">Qtd. mínima</Label>
          <Input id="minQuantity" name="minQuantity" type="number" step="0.001" min="0" defaultValue={1} />
        </div>
        <div>
          <Label htmlFor="unitStep">Incremento</Label>
          <Input id="unitStep" name="unitStep" type="number" step="0.001" min="0" defaultValue={1} />
        </div>
        <div>
          <Label htmlFor="categoryId">Categoria</Label>
          <Select id="categoryId" name="categoryId" defaultValue="">
            <option value="">Sem categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select id="status" name="status" defaultValue="ACTIVE">
          <option value="ACTIVE">Ativo</option>
          <option value="PAUSED">Pausado</option>
          <option value="DRAFT">Rascunho</option>
          <option value="OUT_OF_STOCK">Esgotado</option>
        </Select>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Cadastrar produto"}
      </Button>
    </form>
  );
}
