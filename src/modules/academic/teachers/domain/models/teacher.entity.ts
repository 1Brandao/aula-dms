export class Teacher {
    private readonly _id?: string;
    private _name: string;
    private _email: string;
    private _document: string;
    private _registration: string;
    private readonly _createdAt?: Date;
    private readonly _updatedAt?: Date;

    private constructor(id?: string, createdAt?: Date, updatedAt?: Date) {
        this._id = id;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get id(): string | undefined {
        return this._id;
    }
    get name(): string {
        return this._name;
    }
    get document(): string {
        return this._document;
    }
    get email(): string {
        return this._email;
    }
    get registration(): string {
        return this._registration;
    }
    get createdAt(): Date | undefined {
        return this._createdAt;
    }
    get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    withName(name: string) {
        this._name = name;
        return this;
    }
    withDocument(document: string) {
        this._document = document;
        return this;
    }
    withEmail(email: string) {
        this._email = email;
        return this;
    }
    withRegistration(registration: string) {
        this._registration = registration;
        return this;
    }

    static restore(props?: {
        id?: string;
        name: string;
        document: string;
        email: string;
        registration: string;
        createdAt?: Date;
        updatedAt?: Date;
    }): Teacher | null {
        if (!props) return null;

        const teacher = new Teacher(props.id, props.createdAt, props.updatedAt);

        teacher._name = props.name;
        teacher._document = props.document;
        teacher._email = props.email;
        teacher._registration = props.registration;

        return teacher;
    }
}
