import { DriverCard } from "@/components/DriverCard";
import { SectionTitle } from "@/components/SectionTitle";
import { drivers } from "@/lib/data";
import { getStaticRaces } from "@/lib/races";
import { isUpcoming } from "@/lib/utils";

export default async function DriversPage() {
  const localRaces = getStaticRaces();

  const upcomingByDriver = (driverId: string) => {
    const driver = drivers.find((item) => item.id === driverId);
    if (!driver) return 0;

    if (driver.series) {
      return 0;
    }

    return localRaces.filter((race) => isUpcoming(race.startDate) && race.latvianDrivers.includes(driverId)).length;
  };

  const internationalDrivers = drivers
    .filter((driver) => driver.series === "F1" && driver.role === "Driver")
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const f1TeamPrincipals = drivers
    .filter((driver) => driver.series === "F1" && driver.role === "Team Principal")
    .slice()
    .sort((a, b) => a.team?.localeCompare(b.team ?? "") ?? 0);

  const wrcDrivers = drivers
    .filter((driver) => driver.series === "WRC" && driver.role === "Driver")
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const wrcCoDrivers = drivers
    .filter((driver) => driver.series === "WRC" && driver.role === "Co-Driver")
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const wrcTeamPrincipals = drivers
    .filter((driver) => driver.series === "WRC" && driver.role === "Team Principal")
    .slice()
    .sort((a, b) => a.team?.localeCompare(b.team ?? "") ?? 0);

  const latvianDrivers = drivers
    .filter((driver) => !driver.series)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="space-y-8">
      <section className="space-y-4">
        <SectionTitle>Latvian Drivers</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {latvianDrivers.map((driver) => (
            <DriverCard key={driver.id} driver={driver} upcomingCount={upcomingByDriver(driver.id)} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>International F1 Drivers</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {internationalDrivers.map((driver) => (
            <DriverCard key={driver.id} driver={driver} upcomingCount={upcomingByDriver(driver.id)} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>F1 Team Principals</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {f1TeamPrincipals.map((driver) => (
            <DriverCard key={driver.id} driver={driver} upcomingCount={upcomingByDriver(driver.id)} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>WRC Drivers</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {wrcDrivers.map((driver) => (
            <DriverCard key={driver.id} driver={driver} upcomingCount={upcomingByDriver(driver.id)} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>WRC Co-Drivers</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {wrcCoDrivers.map((driver) => (
            <DriverCard key={driver.id} driver={driver} upcomingCount={upcomingByDriver(driver.id)} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>WRC Team Principals</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {wrcTeamPrincipals.map((driver) => (
            <DriverCard key={driver.id} driver={driver} upcomingCount={upcomingByDriver(driver.id)} />
          ))}
        </div>
      </section>
    </main>
  );
}
