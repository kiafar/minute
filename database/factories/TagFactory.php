<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tag>
 */
class TagFactory extends Factory
{
    // List of 50 random tag names
    private $tags = [
        'PHP',
        'Laravel',
        'JavaScript',
        'Vue.js',
        'React',
        'Angular',
        'Node.js',
        'Express.js',
        'Svelte',
        'Python',
        'Django',
        'Flask',
        'Ruby',
        'Ruby on Rails',
        'Java',
        'Spring Boot',
        'Kotlin',
        'Android',
        'Swift',
        'iOS',
        'Objective-C',
        'C#',
        'ASP.NET',
        'SQL',
        'MySQL',
        'PostgreSQL',
        'MongoDB',
        'Docker',
        'Kubernetes',
        'AWS',
        'Azure',
        'Google Cloud',
        'Firebase',
        'Heroku',
        'Netlify',
        'Vercel',
        'DigitalOcean',
        'Git',
        'GitHub',
        'GitLab',
        'Bitbucket',
        'Jenkins',
        'CircleCI',
        'Travis CI',
        'Codecov',
        'Coveralls',
        'Codecov',
        'SonarQube',
        'Jira',
        'Trello',
    ];
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement($this->tags),
        ];
    }
}
