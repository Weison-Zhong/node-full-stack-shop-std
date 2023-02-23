import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Book {

    @ApiProperty({
        description: 'The Name of the Book'
    })
    bookName: string;

    @ApiProperty({
        description: 'The Name of the Author'
    })
    @ApiPropertyOptional()
    authorName: string;

    @ApiProperty({
        description: 'The Year of Publishing',
        type: Number
    })
    publishYear: number;

    @ApiProperty({
        description: 'Book Availability',
        default: false
    })
    isAvailable: boolean;

    @ApiProperty({
        description: 'Type of Book',
        enum: ['Fantasy', 'Science Fiction', 'Thriller']
    })
    genre: string;
}