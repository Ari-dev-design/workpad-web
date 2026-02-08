import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#7c3aed" },
  subtitle: { fontSize: 10, color: "gray" },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
    paddingTop: 5,
  },
  label: { width: "40%", fontSize: 12, color: "#555" },
  value: { width: "60%", fontSize: 12, fontWeight: "bold" },
  totalSection: { marginTop: 30, alignItems: "flex-end" },
  totalLabel: { fontSize: 14, color: "#7c3aed" },
  totalValue: { fontSize: 20, fontWeight: "bold" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    color: "gray",
  },
});

export const InvoiceDocument = ({ invoice, projectName }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>WORKPAD</Text>
          <Text style={styles.subtitle}>
            Gestión de tus Servicios Digitales
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 12, color: "gray" }}>
            Factura #{invoice.number}
          </Text>
          <Text style={{ fontSize: 10, color: "gray" }}>
            Fecha: {invoice.date}
          </Text>
        </View>
      </View>

      <View
        style={{ height: 2, backgroundColor: "#7c3aed", marginBottom: 20 }}
      />

      <View>
        <View style={styles.row}>
          <Text style={styles.label}>Concepto / Proyecto:</Text>
          <Text style={styles.value}>
            {projectName || "Servicios Generales"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={styles.value}>
            {invoice.status === "Paid" || invoice.status === "Pagada"
              ? "PAGADA"
              : "PENDIENTE"}
          </Text>
        </View>
      </View>

      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Total a Pagar</Text>
        <Text style={styles.totalValue}>
          {parseFloat(invoice.amount).toFixed(2)} €
        </Text>
      </View>

      <View style={styles.footer}>
        <Text>Todos los derechos reservados.</Text>
      </View>
    </Page>
  </Document>
);
