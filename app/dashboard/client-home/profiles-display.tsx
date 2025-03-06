import { Chip, CircularProgress, User } from "@heroui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import Link from "next/link";

const ProfilesDisplay = ({ data }: { data: any[] | null }) => {
    if (!data) {
        return null;
    }

    return (
        <div className="grid grid-cols-3 w-full gap-8">
            {data.map((provider: any, i) => (
                <Link
                    key={i}
                    href={{
                        pathname: `/dashboard/profile/${provider.username}`,
                        query: {
                            first_name: provider.first_name,
                            last_name: provider.last_name,
                            description: "Product Designer",
                        },
                    }}
                >
                    <Card className="p-4">
                        <CardHeader>
                            <div className="flex flex-row gap-4 items-center">
                                <img src={provider.profile_picture} alt="" className="h-16 w-16 object-cover rounded-full" />
                                <div>
                                    <p>{provider.first_name + " " + provider.last_name}</p>
                                    <p className="text-sm">{provider.service_type}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="h-32 text-sm">
                                <p>{provider.description}</p>
                            </div>
                        </CardBody>
                        <CardFooter>
                            <Chip color="warning" variant="bordered" radius="md">
                                {provider.experience_years} years experience
                            </Chip>
                        </CardFooter>
                    </Card>
                    {/* <User
                        avatarProps={{
                            src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                        }}
                        description="Product Designer"
                        name={provider.first_name + " " + provider.last_name}
                    /> */}
                </Link>
            ))}
        </div>
    );
};

export default ProfilesDisplay;