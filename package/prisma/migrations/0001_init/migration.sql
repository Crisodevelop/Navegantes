-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "encf" TEXT NOT NULL,
    "tipoEcf" TEXT NOT NULL,
    "fechaEmision" TEXT NOT NULL,
    "fechaVencimiento" TEXT,
    "emisorNombre" TEXT NOT NULL,
    "emisorRazonSocial" TEXT NOT NULL,
    "emisorRnc" TEXT NOT NULL,
    "emisorDireccion" TEXT NOT NULL,
    "emisorTelefono" TEXT,
    "clienteRazonSocial" TEXT,
    "clienteRnc" TEXT,
    "subtotalGravado" DECIMAL(14,2) NOT NULL,
    "subtotalExento" DECIMAL(14,2) NOT NULL,
    "totalItbis" DECIMAL(14,2) NOT NULL,
    "propinaLegal" DECIMAL(14,2) NOT NULL,
    "montoTotal" DECIMAL(14,2) NOT NULL,
    "codigoSeguridad" TEXT NOT NULL,
    "fechaFirma" TEXT NOT NULL,
    "qrUrl" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "unidad" TEXT NOT NULL,
    "precio" DECIMAL(14,2) NOT NULL,
    "itbis" DECIMAL(14,2) NOT NULL,
    "descuento" DECIMAL(14,2) NOT NULL,
    "recargo" DECIMAL(14,2) NOT NULL,
    "valor" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_encf_key" ON "Invoice"("encf");

-- CreateIndex
CREATE INDEX "InvoiceItem_invoiceId_idx" ON "InvoiceItem"("invoiceId");

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

